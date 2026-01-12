import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import prisma from '@/lib/prisma';
import { getDaysUntil } from '@/lib/dates';
import { getTranslations } from '@/lib/i18n';
import type { Language } from '@/types';

const resend = new Resend(process.env.RESEND_API_KEY);

const REMINDER_DAYS = [30, 7, 1, 0];

interface ExpiryItem {
  type: 'registration' | 'insurance' | 'inspection';
  date: Date;
  daysUntil: number;
}

export async function GET(request: Request) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Get all vehicles with their users
    const vehicles = await prisma.vehicle.findMany({
      include: {
        user: {
          select: { email: true, language: true },
        },
      },
    });

    let sentCount = 0;
    const errors: string[] = [];

    for (const vehicle of vehicles) {
      const expiries: ExpiryItem[] = [
        { type: 'registration', date: vehicle.regExpiry, daysUntil: getDaysUntil(vehicle.regExpiry) },
        { type: 'insurance', date: vehicle.insExpiry, daysUntil: getDaysUntil(vehicle.insExpiry) },
        { type: 'inspection', date: vehicle.inspExpiry, daysUntil: getDaysUntil(vehicle.inspExpiry) },
      ];

      for (const expiry of expiries) {
        for (const reminderDay of REMINDER_DAYS) {
          // Check if we should send a reminder for this day
          if (expiry.daysUntil === reminderDay) {
            const reminderType = `${reminderDay}d`;

            // Check if we already sent this reminder
            const existingReminder = await prisma.reminderLog.findUnique({
              where: {
                vehicleId_reminderType_expiryType: {
                  vehicleId: vehicle.id,
                  reminderType,
                  expiryType: expiry.type,
                },
              },
            });

            if (existingReminder) {
              continue; // Already sent this reminder
            }

            try {
              // Get translations for user's language
              const t = getTranslations((vehicle.user.language || 'mk') as Language);
              
              // Send email
              const emailResult = await sendReminderEmail({
                to: vehicle.user.email,
                plate: vehicle.plate,
                expiryType: expiry.type,
                daysUntil: expiry.daysUntil,
                translations: t,
              });

              if (emailResult.success) {
                // Log the reminder
                await prisma.reminderLog.create({
                  data: {
                    userId: vehicle.userId,
                    vehicleId: vehicle.id,
                    reminderType,
                    expiryType: expiry.type,
                  },
                });
                sentCount++;
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              errors.push(`Failed to send reminder for ${vehicle.plate}: ${errorMessage}`);
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      sentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { message: 'Something went wrong' },
      { status: 500 }
    );
  }
}

interface SendReminderEmailParams {
  to: string;
  plate: string;
  expiryType: 'registration' | 'insurance' | 'inspection';
  daysUntil: number;
  translations: ReturnType<typeof getTranslations>;
}

async function sendReminderEmail({
  to,
  plate,
  expiryType,
  daysUntil,
  translations: t,
}: SendReminderEmailParams): Promise<{ success: boolean }> {
  const expiryLabels = {
    registration: t.vehicles.registration,
    insurance: t.vehicles.insurance,
    inspection: t.vehicles.inspection,
  };

  const urgencyLabel = daysUntil === 0 
    ? t.status.expired 
    : daysUntil === 1 
      ? `1 ${t.common.day}` 
      : `${daysUntil} ${t.common.days}`;

  const subject = daysUntil === 0
    ? `⚠️ ${t.common.appName}: ${plate} - ${expiryLabels[expiryType]} ${t.status.expired}!`
    : `🚗 ${t.common.appName}: ${plate} - ${expiryLabels[expiryType]} - ${urgencyLabel}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 16px; border-radius: 16px; margin-bottom: 16px;">
              <span style="font-size: 32px;">🚗</span>
            </div>
            <h1 style="font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin: 0;">
              ${t.common.appName}
            </h1>
          </div>
          
          <div style="background: ${daysUntil === 0 ? 'rgba(239, 68, 68, 0.2)' : daysUntil <= 7 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(6, 182, 212, 0.2)'}; border: 1px solid ${daysUntil === 0 ? 'rgba(239, 68, 68, 0.3)' : daysUntil <= 7 ? 'rgba(245, 158, 11, 0.3)' : 'rgba(6, 182, 212, 0.3)'}; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <p style="font-size: 32px; font-weight: bold; margin: 0 0 8px 0; color: #fff;">${plate}</p>
            <p style="font-size: 16px; color: #94a3b8; margin: 0;">${expiryLabels[expiryType]}</p>
          </div>
          
          <div style="text-align: center; margin-bottom: 32px;">
            <p style="font-size: 48px; font-weight: bold; margin: 0; color: ${daysUntil === 0 ? '#ef4444' : daysUntil <= 7 ? '#f59e0b' : '#06b6d4'};">
              ${daysUntil === 0 ? '⚠️' : urgencyLabel}
            </p>
            <p style="font-size: 14px; color: #64748b; margin: 8px 0 0 0;">
              ${daysUntil === 0 ? t.status.expired : t.common.daysLeft}
            </p>
          </div>
          
          <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="font-size: 12px; color: #64748b; margin: 0;">
              ${t.common.appName} - ${t.common.hero}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: 'VozenPark <notifications@vozenpark.com>',
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false };
  }
}


from django.utils import timezone

from .models import Reminder


REMINDER_TEMPLATES = {
    "EN": {
        "BEFORE": (
            "Dear Parent, your fee instalment of "
            "₹{amount} is due on {due_date}. "
            "Please complete the payment."
        ),
        "DUE": (
            "Dear Parent, your fee instalment of "
            "₹{amount} is due today. Please make the payment."
        ),
        "AFTER": (
            "Dear Parent, your fee payment of "
            "₹{amount} is overdue by {days} days. "
            "Please complete the payment."
        ),
    },
    "HI": {
        "BEFORE": (
            "प्रिय अभिभावक, ₹{amount} की फीस की किस्त "
            "{due_date} को देय है। कृपया समय पर भुगतान करें।"
        ),
        "DUE": (
            "प्रिय अभिभावक, ₹{amount} की फीस की किस्त "
            "आज देय है। कृपया भुगतान करें।"
        ),
        "AFTER": (
            "प्रिय अभिभावक, ₹{amount} की फीस "
            "{days} दिनों से बकाया है। कृपया भुगतान करें।"
        ),
    },
}


def generate_message(installment, language, reminder_type):

    language = language if language in REMINDER_TEMPLATES else "EN"

    template = REMINDER_TEMPLATES[language][reminder_type]

    return template.format(
        amount=installment.balance,
        due_date=installment.due_date.strftime("%d-%m-%Y"),
        days=installment.days_overdue,
    )


def create_reminder(installment, language, reminder_type):

    # Do not generate reminders for fully paid installments.
    if installment.balance <= 0:
        return None

    if installment.status == "PAID":
        return None

    language = language if language in REMINDER_TEMPLATES else "EN"

    today = timezone.localdate()

    # Prevent duplicate reminders for the same installment,
    # reminder type, and date, regardless of language.
    existing = Reminder.objects.filter(
        installment=installment,
        message_type=reminder_type,
        scheduled_for__date=today
    ).exists()

    if existing:
        return None

    message = generate_message(
        installment,
        language,
        reminder_type
    )

    return Reminder.objects.create(
        installment=installment,
        scheduled_for=timezone.now(),
        language=language,
        message=message,
        message_type=reminder_type,
    )


def stop_pending_reminders(installment):

    Reminder.objects.filter(
        installment=installment,
        status=Reminder.Status.PENDING
    ).update(
        status=Reminder.Status.SKIPPED
    )


from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta


def calculate_pro_rata_refund(
    amount_paid,
    course_start,
    course_end,
    withdrawal_date
):
    """
    Illustrative policy assumption:

    Refund = Amount paid × Remaining days / Total course days

    Course duration is calculated using calendar-day differences.
    """

    if course_end <= course_start:
        raise ValueError(
            "Course end date must be after course start date."
        )

    if withdrawal_date < course_start:
        raise ValueError(
            "Withdrawal cannot be before course start."
        )

    amount_paid = Decimal(str(amount_paid))

    if amount_paid < 0:
        raise ValueError("Amount paid cannot be negative.")

    total_days = (course_end - course_start).days

    remaining_days = max(
        0,
        (course_end - withdrawal_date).days
    )

    remaining_days = min(remaining_days, total_days)

    refund = (
        amount_paid
        * Decimal(remaining_days)
        / Decimal(total_days)
    )

    refund = refund.quantize(
        Decimal("0.01"),
        rounding=ROUND_HALF_UP
    )

    return {
        "amount_paid": amount_paid,
        "total_course_days": total_days,
        "remaining_days": remaining_days,
        "used_days": total_days - remaining_days,
        "refund_amount": refund,
        "processing_deadline": (
            withdrawal_date + timedelta(days=10)
        ),
    }

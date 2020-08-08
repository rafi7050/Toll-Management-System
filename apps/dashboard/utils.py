from calendar import monthrange, month_name
import datetime


def all_days_current_month():
    today = datetime.datetime.now()
    num_days = monthrange(today.year, today.month)[1]
    day_list = []
    for item in range(1, num_days + 1):
        day_list.append(item)
    return day_list


def all_month_name():
    month = []
    for item in range(1, 13):
        month.append((item, month_name[item]))
    return month


def last_day_of_month(year, month):
    return datetime.datetime(year, month, monthrange(year, month)[1])

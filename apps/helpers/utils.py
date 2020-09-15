import datetime

STATUS_TYPE = (
    (1, 'Active'),
    (0, 'Inactive'),
)

GENDER_CHOICES = (
    (1, 'Male'),
    (2, 'Female'),
    (3, 'Others'),
)

UNIT = (
    (1, 'KG'),
    (2, 'Bundle'),
    (3, 'Piece'),
    (4, 'Dozen'),
)

SIZE = (
    (1, '2-3 Persons'),
    (2, '4-5 Persons'),
    (3, '6-8 Persons'),
)

ORDER_STATUS = (
    (1, 'New'),
    (2, 'Confirmed'),
    (3, 'Delivered'),
    (4, 'Customer Busy'),
    (5, 'Order Cancel'),
    (6, 'Phone Not Received'),
)

FOLLOW_UP_PURPOSE = (
    (1, 'Initial Call'),
    (2, 'Documentation'),
    (3, 'To Inform File Status'),
    (4, 'Call Back Request'),
    # (5, 'Scheduling'),
    (6, 'Extra Documents'),
    (7, 'File Return'),
    (8, 'File Courier'),
    (9, 'File Collection'),
    (10, 'Return from Bank'),
)

CUSTOMER_STATUS_CHOICES = (
    (0, 'New'),
    (1, 'Not Contact Yet'),
    (2, 'Not Interested Now'),
    (3, 'Application on Process'),
    (4, 'Already Avail Loan'),
    (5, 'Already Avail Card'),
    (6, 'High DBR'),
    (7, 'CIB Problem'),
    (8, 'Incorrect Info'),
    (9, 'Phone Not Receive'),
    (10, 'Call Later'),
    (11, 'Already Contacted'),
    (12, 'Out of Range'),
    (13, 'Number Invalid'),
    (14, 'Low Income'),
    (15, 'Hand Cash Salary'),
    (16, 'Test'),
    (17, 'Not Now'),
    (18, 'Businessman'),
    (19, 'Land Lord'),
)

USER_TYPE = (
    (1, 'BCBD Member'),
    (2, 'Customer'),
)

USER_PROFESSION_CHOICES = (
    (1, 'Salaried'),
    (2, 'Businessman'),
    (3, 'Landlord'),
    (4, 'Professional'),
    (5, 'HouseWife'),
    (6, 'Student'),
    (7, 'Others'),
)

PACKAGE_TYPE = (
    (1, 'Public'),
    (2, 'Privet/Custom'),
)

today_start = datetime.datetime.combine(datetime.date.today(), datetime.datetime.min.time())

ORDER_ITEM_TYPE = (
    (1, 'Package'),
    (2, 'Product'),
)

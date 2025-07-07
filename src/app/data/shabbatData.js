// Utility function to get sorted Shabbats (closest first)
export const getSortedShabbats = () => {
    const today = new Date();
    return shabbatAndHolidays
        .filter(shabbat => new Date(shabbat.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
};

// Utility function to format display date
export const formatShabbatDate = (shabbat) => {
    const start = new Date(shabbat.startDate);
    const end = new Date(shabbat.endDate);

    const startDay = start.getDate().toString().padStart(2, '0');
    const endDay = end.getDate().toString().padStart(2, '0');
    const month = (start.getMonth() + 1).toString().padStart(2, '0');
    const year = start.getFullYear();

    return `${startDay}-${endDay}/${month}/${year}`;
};

export const shabbatAndHolidays = [
    {
        name: "Parashat Chukat",
        startDate: "2025-07-04", // Friday
        endDate: "2025-07-05",   // Saturday
        date: "04-05/07/2025", // Keep for backward compatibility
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Balak",
        startDate: "2025-07-11",
        endDate: "2025-07-12",
        date: "11-12/07/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Pinchas",
        startDate: "2025-07-18",
        endDate: "2025-07-19",
        date: "18-19/07/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Matot-Masei",
        startDate: "2025-07-25",
        endDate: "2025-07-26",
        date: "25-26/07/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Devarin",
        startDate: "2025-08-01",
        endDate: "2025-08-02",
        date: "01-02/08/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Vaechanan",
        startDate: "2025-08-08",
        endDate: "2025-08-09",
        date: "08-09/08/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Eikev",
        startDate: "2025-08-15",
        endDate: "2025-08-16",
        date: "15-16/08/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Reeh",
        startDate: "2025-08-22",
        endDate: "2025-08-23",
        date: "22-23/08/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Shoftim",
        startDate: "2025-08-29",
        endDate: "2025-08-30",
        date: "29-30/08/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Ki Teitzei",
        startDate: "2025-09-05",
        endDate: "2025-09-06",
        date: "05-06/09/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Ki Tavo",
        startDate: "2025-09-12",
        endDate: "2025-09-13",
        date: "12-13/09/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Nitzavim",
        startDate: "2025-09-19",
        endDate: "2025-09-20",
        date: "19-20/09/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Vayellech",
        startDate: "2025-09-26",
        endDate: "2025-09-27",
        date: "26-27/09/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Ha'azinu",
        startDate: "2025-10-03",
        endDate: "2025-10-04",
        date: "03-04/10/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Bereshit",
        startDate: "2025-10-17",
        endDate: "2025-10-18",
        date: "17-18/10/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Noach",
        startDate: "2025-10-24",
        endDate: "2025-10-25",
        date: "24-25/10/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Lech-Lecha",
        startDate: "2025-10-31",
        endDate: "2025-11-01",
        date: "31/10-01/11/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Vayera",
        startDate: "2025-11-07",
        endDate: "2025-11-08",
        date: "07-08/11/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Chayei Sara",
        startDate: "2025-11-14",
        endDate: "2025-11-15",
        date: "14-15/11/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    },
    {
        name: "Parashat Toldot",
        startDate: "2025-11-21",
        endDate: "2025-11-22",
        date: "21-22/11/2025",
        fridayNight: [
            {
                activity: "Candle lighting time",
                hora: "17:36am"
            }
        ],
        shabbatDay: [
            {
                activity: "Shabbat morning prayer",
                hora: "10:00am"
            }
        ],
    }
];

export const pricesRegistrationShabbat = [
    {
        product: "Friday Day Dinner",
        prices: [
            {
                name: "Supporter",
                price: 180
            },
            {
                name: "Kids 3-10 Yo",
                price: 42
            },
        ]
    },
    {
        product: "Shabbat Lunch",
        prices: [
            {
                name: "Supporter",
                price: 180
            },
            {
                name: "Kids 3-10 Yo",
                price: 42
            },
        ]
    }
];



export const shabbatBoxOptions = [
    {
        category: "FRIDAY NIGHT DINNER",
        options: [
            {
                id: 1,
                name: "SHABBAT ELEGANCE (FRIDAY NIGHT DINNER)",
                includes: [
                    "2 shabbat tea candles",
                    "1 bottle kidush wine",
                    "2 Challah",
                    "Elegant plastic serve wear",
                    "3 dips",
                    "3 salads",
                    "Fish (Moroccan fish or teriyaki salmon)",
                    "Meat balls",
                    "Roasted chicken",
                    "Rice",
                    "Roasted potatoes or veggies",
                    "Cake for desert (vanilla or chocolate)"
                ],
                servingSize: "Two people",
                basePrice: 220.00,
                additionalGuestPrice: 100.00,
                quantity: 0
            },
            {
                id: 2,
                name: "SHABBAT PRESTIGE (FRIDAY NIGHT DINNER)",
                includes: [
                    "2 shabbat tea candles",
                    "1 bottle dry wine",
                    "2 Challah",
                    "Elegant plastic serve wear",
                    "3 dips",
                    "4 salads",
                    "Fish (Moroccan fish or teriyaki salmon)",
                    "Fine meat dish",
                    "Meat balls",
                    "Roasted chicken",
                    "Rice",
                    "Roasted potatoes",
                    "Cake for desert (vanilla or chocolate)"
                ],
                servingSize: "Two people",
                basePrice: 270.00,
                additionalGuestPrice: 110.00,
            }
        ]
    },
    {
        category: "SHABBAT LUNCH",
        options: [
            {
                id: 3,
                name: "SHABBAT ELEGANCE (SHABBAT LUNCH)",
                includes: [
                    "1 bottle Kidush wine",
                    "2 Challah",
                    "Elegant plastic serve wear",
                    "3 dips",
                    "3 salads",
                    "Tuna salad",
                    "Shnitzel fingers",
                    "Potato kugel",
                    "Cake for desert (vanilla or chocolate)"
                ],
                servingSize: "Two people",
                basePrice: 200.00,
                additionalGuestPrice: 87.00,
            },
            {
                id: 4,
                name: "SHABBAT PRESTIGE (SHABBAT LUNCH)",
                includes: [
                    "1 bottle dry wine",
                    "2 Challah",
                    "Elegant plastic serve wear",
                    "3 dips",
                    "3 salads",
                    "Tuna salad",
                    "Smoked Salmon",
                    "Shnitzel fingers",
                    "Potato kugel",
                    "Cold cuts",
                    "Cake for desert (vanilla or chocolate)"
                ],
                servingSize: "Two people",
                basePrice: 250.00,
                additionalGuestPrice: 110.00,
            }
        ]
    },
    {
        category: "MORE OPTIONS",
        options: [
            {
                id: 5,
                name: "Hotplate rental",
                description: "+70 deposit",
                basePrice: 100.00,
                details: "$30 rental + $70 deposit",
            },
            {
                id: 6,
                name: "Cholent + Crockpot",
                description: "The cholent comes raw in the crockpot with all ingredients and condiments. It's so easy, you just have to add water and plug in. The crockpot will be yours",
                variants: [
                    {
                        size: "Small",
                        serves: "2-3 people",
                        price: 100.00,
                        quantity: 0
                    },
                    {
                        size: "Medium",
                        serves: "4-6 people",
                        price: 140.00,
                    },
                    {
                        size: "Large",
                        serves: "8-10 people",
                        price: 180.00,
                    }
                ]
            }
        ]
    }
];
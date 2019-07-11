// Windows data
const WIN_OS   = ["Windows NT 6.1", "Windows NT 6.2", "Windows NT 6.3", "Windows NT 10.0"];
const WIN_PROC = ["", "WOW64", "Win64; x64"];

// Linux data
const LIN_OS   = ["X11; Linux"];
const LIN_PROC = ["i686", "x86_64"];

// Fingerprint data
const DATA = {
    // chrome = 0, firefox = 1, opera = 2
    "browsers" : [
        // CHROME
        {
            "name" : "chrome",
            "weight" : 0.8527,
            "os" : [
                {"name" : WIN_OS[0], "proc" : WIN_PROC[0], "weight" : 0.4303},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[1], "weight" : 0.4303},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[2], "weight" : 0.4303},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[0], "weight" : 0.0085},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[1], "weight" : 0.0085},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[2], "weight" : 0.0085},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[0], "weight" : 0.0461},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[1], "weight" : 0.0461},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[2], "weight" : 0.0461},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[0], "weight" : 0.4970},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[1], "weight" : 0.4970},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[2], "weight" : 0.4970},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[0], "weight" : 0.0181},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[1], "weight" : 0.0181}
            ],
            "versions" : [
                {
                    "number" : "74.0.3729",
                    "weight" :  0.2034,
                    "patches": [
                        {
                            "numbers" : [108,131,157,169]
                        }
                    ]
                },
                {
                    "number" : "73.0.3683",
                    "weight" : 0.4664,
                    "patches": [
                        {
                            "numbers" : [75,86,103]
                        }
                    ]
                },
                {
                    "number" : "72.0.3626",
                    "weight" : 0.2860,
                    "patches": [
                        {
                            "numbers" : [81,96,109,119,121]
                        }
                    ]
                },
                {
                    "number" : "71.0.3578",
                    "weight" : 0.0191,
                    "patches": [
                        {
                            "numbers" : [80, 98]
                        }
                    ]
                },
                {
                    "number" : "70.0.3538",
                    "weight" : 0.0086,
                    "patches": [
                        {
                            "numbers" : [67, 77, 102, 110]
                        }
                    ]
                },
                {
                    "number" : "69.0.3497",
                    "weight" : 0.0069,
                    "patches": [
                        {
                            "numbers" : [81, 92, 100]
                        }
                    ]
                },
                {
                    "number" : "68.0.3440",
                    "weight" : 0.0042,
                    "patches": [
                        {
                            "numbers" : [75, 84, 106]
                        }
                    ]
                },
                {
                    "number" : "67.0.3396",
                    "weight" : 0.0054,
                    "patches": [
                        {
                            "numbers" : [62, 79, 87, 99]
                        }
                    ]
                }
            ],
            "http" : {
                "order" : [
                    "Host",
                    "Connection",
                    "Upgrade-Insecure-Requests",
                    "User-Agent",
                    "Accept",
                    "Accept-Encoding",
                    "Accept-Language"
                ],
                "encoding" : "gzip, deflate, br",
                "Upgrade-Insecure-Requests" : 1
            },
            "appcodename" : "Mozilla",
            "appname" : "Netscape",
            "product" : "Gecko",
            "productSub" : "20030107",
            "vendor" : "Google Inc.",   
            "webkit_version" : "537.36"
        },
        // FIREFOX
        {
            "name" : "firefox",
            "weight" : 0.1177,
            "os" : [
                {"name" : WIN_OS[0], "proc" : WIN_PROC[0], "weight" : 0.4036},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[1], "weight" : 0.4036},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[2], "weight" : 0.4036},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[0], "weight" : 0.0153},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[1], "weight" : 0.0153},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[2], "weight" : 0.0153},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[0], "weight" : 0.0637},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[1], "weight" : 0.0637},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[2], "weight" : 0.0637},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[0], "weight" : 0.4908},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[1], "weight" : 0.4908},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[2], "weight" : 0.4908},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[0], "weight" : 0.0267},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[1], "weight" : 0.0267}
            ],
            "versions" : [
                {
                    "number" : "67.0",
                    "weight" : 0.0196,
                    "buildid": "20181001000000"
                },	
                {
                    "number" : "66.0",
                    "weight" :  0.5892,
                    "buildid": "20181001000000"
                },
                {
                    "number" : "65.0",
                    "weight" : 0.2581,
                    "buildid": "20181001000000"
                },
                {
                    "number" : "64.0",
                    "weight" : 0.0151,
                    "buildid": "20181001000000"
                },
                {
                    "number" : "63.0",
                    "weight" : 0.0081,
                    "buildid": "20181018182531"
                },
                {
                    "number" : "62.0",
                    "weight" : 0.0058,
                    "buildid": "20180830143136"
                },
                {
                    "number" : "61.0",
                    "weight" : 0.0058,
                    "buildid": "20180621125625"
                },  
                {
                    "number" : "60.0",
                    "weight" : 0.0440,
                    "buildid": "20180503164101"
                },
                {
                    "number" : "52.0",
                    "weight" : 0.0544,
                    "buildid": "20170302120751"
                }
            ],
            "http" : {
                "order" : [
                    "Host",
                    "User-Agent",
                    "Accept",
                    "Accept-Language",
                    "Accept-Encoding"
                ],
                "encoding" : "gzip, deflate"
            },
            "appcodename" : "Mozilla",
            "appname" : "Netscape",
            "product" : "Gecko",
            "productSub" : "20100101",
            "vendor" : "",
            "verdorsub" : ""
        },
        // OPERA
        {
            "name" : "opera",
            "weight" : 0.0296,
            "os" : [
                {"name" : WIN_OS[0], "proc" : WIN_PROC[0], "weight" : 0.3795},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[1], "weight" : 0.3795},
                {"name" : WIN_OS[0], "proc" : WIN_PROC[2], "weight" : 0.3795},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[0], "weight" : 0.0172},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[1], "weight" : 0.0172},
                {"name" : WIN_OS[1], "proc" : WIN_PROC[2], "weight" : 0.0172},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[0], "weight" : 0.0812},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[1], "weight" : 0.0812},
                {"name" : WIN_OS[2], "proc" : WIN_PROC[2], "weight" : 0.0812},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[0], "weight" : 0.4982},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[1], "weight" : 0.4982},
                {"name" : WIN_OS[3], "proc" : WIN_PROC[2], "weight" : 0.4982},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[0], "weight" : 0.0240},
                {"name" : LIN_OS[0], "proc" : LIN_PROC[1], "weight" : 0.0240}
            ],
            "versions" : [
                {
                    "number" : "60.0.3255",
                    "weight" : 0.1244,
                    "patches": [
                        {
                            "numbers" : [56,59,70,83,95,109],
                            "Chromium" : "73.0.3683.103"
                        }
                    ]
                },
                {
                    "number" : "58.0.3135",
                    "weight" : 0.8565,
                    "patches": [
                        {
                            "numbers" : [47, 53, 65, 68, 79, 90 , 107, 117, 118, 127],
                            "Chromium" : "71.0.3578.80"
                        }
                    ]
                },
                {
                    "number" : "57.0.3098",
                    "weight" : 0.0096,
                    "patches": [
                        {
                            "numbers" : [76, 91, 102, 106, 110, 116],
                            "Chromium" : "70.0.3538.102"
                        }
                    ]
                },
                {
                    "number" : "56.0.3051",
                    "weight" : 0.0096,
                    "patches": [
                        {
                            "numbers" : [31, 36, 43, 52, 99, 104, 116],
                            "Chromium" : "69.0.3497.100"
                        }
                    ]
                }
            ],
            "http" : {
                "order" : [
                    "Host",
                    "Connection",
                    "Upgrade-Insecure-Requests",
                    "User-Agent",
                    "Accept",
                    "Accept-Encoding",
                    "Accept-Language"
                ],
                "encoding" : "gzip, deflate, br",
                "Upgrade-Insecure-Requests" : 1
            },
            "appcodename" : "Mozilla",
            "appname" : "Netscape",
            "product" : "Gecko",
            "vendor" : "Google Inc.",
            "productSub" : "20030107",
            "webkit_version" : "537.36"
        }
    ],

    "screen" : {
        "resolutions" : [
            {"width" : 1366, "height" : 768,  "weight" : 0.2960},
            {"width" : 1920, "height" : 1080, "weight" : 0.2321},
            {"width" : 1440, "height" : 900,  "weight" : 0.0834},
            {"width" : 1536, "height" : 864,  "weight" : 0.0711},
            {"width" : 1600, "height" : 900,  "weight" : 0.0592},
            {"width" : 1280, "height" : 800,  "weight" : 0.0448},
            {"width" : 1024, "height" : 768,  "weight" : 0.0441},
            {"width" : 1280, "height" : 720,  "weight" : 0.0435},
            {"width" : 1280, "height" : 1024, "weight" : 0.0415},
            {"width" : 1680, "height" : 1050, "weight" : 0.0299},
            {"width" : 2560, "height" : 1440, "weight" : 0.0215},
            {"width" : 1360, "height" : 768,  "weight" : 0.0192},
            {"width" : 1920, "height" : 1200, "weight" : 0.0137}
        ],

        "colordepth" : 24,

        "taskbar" : {
            "win" : 40,
            "lin" : 0
        }
    },

    "languages" : ["en"],
    /*
    "languages" : [
        "af", "sq", "ar-sa", "ar-iq", "ar-eg", "ar-ly", "ar-dz", "ar-ma", "ar-tn", "ar-om", "ar-ye", "ar-sy", "ar-jo", "ar-lb", "ar-kw",
        //"ar-ae", "ar-bh", "ar-qa", "eu", "bg", "be", "ca", "zh-tw", "zh-cn", "zh-hk", "zh-sg", "hr", "cs", "da", "nl", "nl-be", "en", "en-us",
        //"en-gb", "en-au", "en-ca", "en-nz", "en-ie", "en-za", "en-jm", "en-bz", "en-tt", "et", "fo", "fa", "fi", "fr", "fr-be", "fr-ca", 
        //"fr-ch", "fr-lu", "gd", "gd-ie", "de", "de-ch", "de-at", "de-lu", "de-li", "el", "he", "hi", "hu", "is", "id", "it", "it-ch", "ja",
        //"ko", "lv", "lt", "mk", "ms", "mt", "no", "pl", "pt-br", "pt-pt", "rm", "ro", "ro-mo", "ru", "ru-mo", "sz", "sr", "sk", "sl", "sb",
        //"es", "es-ar", "es-gt", "es-cr", "es-pa", "es-do", "es-mx", "es-ve", "es-co", "es-pe", "es-ec", "es-cl", "es-uy", "es-py", "es-bo",
        //"es-sv", "es-hn", "es-ni", "es-pr", "sx", "sv", "sv-fi", "th", "ts", "tn", "tr", "uk", "ur", "ve", "vi", "xh", "ji", "zu"
    ],
    */

    "timezones" : [
        -720, -660, -600, -570, -540, -480, -420, -360, -300, -270,
        -240, -210, -180, -120,  -60,    0,   60,  120,  180,  210,
         240,  270,  300,  330,  345,  360,  390,  420,  480,  525,
         540,  570,  600,  630,  660,  690,  720,  765,  780,  840
    ]
};
export default DATA;

import { scale, verticalScale } from "@/utils/styling";

export const colors = {
    primary: "#a3e635",
    primaryLight: "#0ea5e9",
    primaryDark: "#0369a1",
    text: "#fff",
    textLight: "#e5e5e5",
    textLighter: "#d4d4d4",
    white: "#fff",
    black: "#000",
    rose: "#ef4444",
    redClose: "#c85250",
    green: "#16a34a",
    neutral50: "#fafafa",
    neutral100: "#f5f5f5",
    neutral200: "#e5e5e5",
    neutral300: "#d4d4d4",
    neutral350: "#CCCCCC",
    neutral400: "#a3a3a3",
    neutral500: "#737373",
    neutral600: "#525252",
    neutral700: "#404040",
    neutral800: "#262626",
    neutral900: "#171717",
    brightOrange: "#FFAC1C",
};

export const lightTheme = {
    // primary colors
    screenBackground: "#e7e7e7",
    primary: "#1982A1",
    primaryLight: "#1982A1",
    primaryDark: "#36BEDA",
    text: "#000",
    descriptionText: "#525252",
    textLight: "#e5e5e5",
    textLighter: "#e5e5e5",
    blueText: "#1982A1",
    primarySelection: "#7cb5c2",

    // common colors
    neutral900: "#fafafa",
    neutral800: "#f5f5f5",
    neutral700: "#e5e5e5",
    neutral600: "#d4d4d4",
    neutral500: "#CCCCCC",
    neutral400: "#a3a3a3",
    neutral350: "#737373",
    neutral300: "#525252",
    neutral200: "#404040",
    neutral100: "#262626",
    neutral50: "#ffffff",

    // general colors
    rose: "#ef4444",
    redClose: "#c85250",
    green: "#16a34a",
    white: "#fff",
    black: "#000",
    brightOrange: "#FFAC1C",

    // blue color
    blue100 :"#B6E8F2", 
    blue200 :"#87E3FF",
    blue300 :"#2098BD",
    blue400: "#136C87",

    blueGrey: "#CEE5EB",
    transactionItemBackground: "#d4d4d4",
    incomeLabelColor: "#404040",
    incomeIconColor: "#CCCCCC",
    searchIcon: "#e5e5e5",
    searchIconBackground: "#a3a3a3",
    greenAdd: "#008000",
    greenAddHover: "#8efa8e",
    tabBarBackground: "#404040"
  };
  
  export const darkTheme = {
    // primary colors
    screenBackground: "#171717",
    primary: "#30AEC7",
    primaryLight: "#30AEC7",
    primaryDark: "#1982A1",
    text: "#fff",
    descriptionText: "#d4d4d4",
    textLight: "#e5e5e5",
    textLighter: "#d4d4d4",
    blueText: "#36BEDA",
    primarySelection: "#8fccd9",

    // common colors
    neutral50: "#fafafa",
    neutral100: "#f5f5f5",
    neutral200: "#e5e5e5",
    neutral300: "#d4d4d4",
    neutral350: "#CCCCCC",
    neutral400: "#a3a3a3",
    neutral500: "#737373",
    neutral600: "#525252",
    neutral700: "#404040",
    neutral800: "#262626",
    neutral900: "#171717",


    // general colors
    rose: "#ef4444",
    redClose: "#c85250",
    green: "#16a34a",
    white: "#fff",
    black: "#000",
    brightOrange: "#FFAC1C",

    // blue color
    blue100 :"#136C87", 
    blue200 :"#2098BD",
    blue300 :"#87E3FF",
    blue400: "#B6E8F2",

    blueGrey: "#A9E4F5",
    transactionItemBackground: "#262626",
    incomeLabelColor: "#404040",
    incomeIconColor: "#CCCCCC",
    searchIcon: "#e5e5e5",
    searchIconBackground: "#404040",
    greenAdd: "#008000",
    greenAddHover: "#8efa8e",
    tabBarBackground: "#737373"
  };


export const spacingX = {
    _3: scale (3),
    _5: scale(5), 
    _7: scale(7), 
    _10: scale(10),
    _12: scale(12),
    _15: scale(15),
    _20: scale(20),
    _25: scale(25),
    _30: scale (30),
    _35: scale (35),
    _40: scale (40),
};


export const spacingY = {
    _5: verticalScale(5),
    _7: verticalScale(7), 
    _10: verticalScale(10), 
    _12: verticalScale(12),
    _15: verticalScale(15),
    _17: verticalScale(17), 
    _20: verticalScale (20), 
    _25: verticalScale(25),
    _30: verticalScale (30), 
    _35: verticalScale (35),
    _40: verticalScale (40),
    _50: verticalScale (50),
    _60: verticalScale(60),
};

export const radius = {
    _3: verticalScale(3),
    _6: verticalScale(6),
    _10: verticalScale(10), 
    _12: verticalScale(12),
    _15: verticalScale(15),
    _17: verticalScale(17), 
    _20: verticalScale (20), 
    _30: verticalScale (30), 
};

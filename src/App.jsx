import { useState, useMemo, useCallback } from "react";
import BitcoinChart from "./BitcoinChart.jsx";

const RAW_DATA = [
  {id:"2003932633",name:"קליטת פרויקט",order:1,phase:"קליטה",deps:[]},
  {id:"2003932642",name:"טלפון הצגה עצמית ומתן הנחיות ללקוח",order:2,phase:"קליטה",deps:[]},
  {id:"2003932652",name:"ווצאפ סיכום שיחה - לפי טמפלט",order:3,phase:"קליטה",deps:[]},
  {id:"2003932744",name:"שליחת הצעת מחיר ללקוח למדידה מצבית",order:4,phase:"מדידה",deps:[]},
  {id:"2003932709",name:"משיכת היתרים",order:5,phase:"היתרים",deps:[]},
  {id:"2022674706",name:"אישור הצעת מחיר למדידה",order:6,phase:"מדידה",deps:[]},
  {id:"2003932755",name:"עדכון חוזה מפה מצבית במחשב",order:7,phase:"מדידה",deps:[]},
  {id:"2003932765",name:"הזמנת מפת מדידה מצבית",order:8,phase:"מדידה",deps:[]},
  {id:"2003932787",name:"קבלת מפת מדידה + חתימה דיגיטלית",order:9,phase:"מדידה",deps:[]},
  {id:"2003932796",name:"מעבר על תקינות מפת מדידה",order:10,phase:"מדידה",deps:[]},
  {id:"2003932803",name:"אישור לקוח על מפת מדידה",order:11,phase:"מדידה",deps:[]},
  {id:"2003932813",name:"פתיחת פקודה לתשלום - מודד - מדידה מצבית",order:12,phase:"מדידה",deps:[]},
  {id:"2003932823",name:"איסוף חומרים לפתיחת בקשה לתיק מידע",order:19,phase:"תיק מידע",deps:[]},
  {id:"2003932890",name:"שולח לוועדה מייל לקבלת אגרה לתיק מידע",order:20,phase:"תיק מידע",deps:["איסוף חומרים לפתיחת בקשה לתיק מידע","מעבר על תקינות מפת מדידה"]},
  {id:"2003932902",name:"תשלום אגרת תיק מידע",order:21,phase:"תיק מידע",deps:[]},
  {id:"2003932910",name:"הגשת טופס לאישור זכויות למנהל",order:22,phase:"תיק מידע",deps:["איסוף חומרים לפתיחת בקשה לתיק מידע"]},
  {id:"2003932917",name:"קבלת אישור זכויות",order:23,phase:"תיק מידע",deps:["הגשת טופס לאישור זכויות למנהל"]},
  {id:"2003932922",name:"פתיחת בקשה לתיק מידע",order:24,phase:"תיק מידע",deps:["קבלת אישור זכויות","תשלום אגרת תיק מידע"]},
  {id:"2003933610",name:"קבלת תיק מידע",order:25,phase:"תיק מידע",deps:["פתיחת בקשה לתיק מידע"]},
  {id:"2003932950",name:"שליחת חומרים לספק קומפילציה",order:26,phase:"קומפילציה",deps:["אישור לקוח על מפת מדידה","משיכת היתרים"]},
  {id:"2023968082",name:"עדכון חוזי במחשב - ספק קומפילציה",order:27,phase:"קומפילציה",deps:["שליחת חומרים לספק קומפילציה"]},
  {id:"2023972872",name:"ביצוע קומפילציה / תחשיבים",order:28,phase:"קומפילציה",deps:["עדכון חוזי במחשב - ספק קומפילציה"]},
  {id:"2003932972",name:"מעבר על קומפילציה שהתקבלה",order:29,phase:"קומפילציה",deps:["ביצוע קומפילציה / תחשיבים"]},
  {id:"2052940073",name:"תשלום לספק קומפילציה",order:30,phase:"קומפילציה",deps:["ביצוע קומפילציה / תחשיבים"]},
  {id:"2023977531",name:"עדכון לקוח בממצאי קומפילציה",order:31,phase:"קומפילציה",deps:["מעבר על קומפילציה שהתקבלה"]},
  {id:"2003932987",name:"תיאום פגישה עם הלקוח במידת הצורך",order:32,phase:"קומפילציה",deps:["עדכון לקוח בממצאי קומפילציה"]},
  {id:"2024050736",name:"הכנת סטטוס פרויקט",order:33,phase:"קומפילציה",deps:["תיאום פגישה עם הלקוח במידת הצורך"]},
  {id:"2003933289",name:"שליחת הצעת מחיר ללקוח - מדידה אדריכלית",order:33.13,phase:"גרמושקה",deps:[]},
  {id:"2003933312",name:"אישור הצעת מחיר לקוח מדידה אדריכלית",order:33.14,phase:"גרמושקה",deps:[]},
  {id:"2023927490",name:"עדכון חוזי במחשב - מדידה אדריכלית",order:33.15,phase:"גרמושקה",deps:[]},
  {id:"2023931277",name:"הזמנת מפת מדידה אדריכלית",order:33.16,phase:"גרמושקה",deps:[]},
  {id:"2023930036",name:"קבלת מפה אדריכלית",order:33.17,phase:"גרמושקה",deps:[]},
  {id:"2003933326",name:"פתיחת פקודה לתשלום מפת מדידה אדריכלית לספק",order:33.18,phase:"גרמושקה",deps:[]},
  {id:"2003933002",name:"הכנת תקציב לפרויקט בהתאם לקובץ",order:34,phase:"התקשרות ספקים",deps:["הכנת סטטוס פרויקט"]},
  {id:"2024052608",name:"שליחת סטטוס פרויקט לספקים",order:35,phase:"התקשרות ספקים",deps:["הכנת תקציב לפרויקט בהתאם לקובץ"]},
  {id:"2003933040",name:"הצעות מחיר - חוזה בסיס",order:36,phase:"התקשרות ספקים",deps:["שליחת סטטוס פרויקט לספקים"]},
  {id:"2003933105",name:"אישור הצעות המחיר מול מנהל מחלקה",order:37,phase:"התקשרות ספקים",deps:[]},
  {id:"2003933162",name:"שליחת הצעת מחיר חתומה לספקים",order:38,phase:"התקשרות ספקים",deps:[]},
  {id:"2003933212",name:"הזנת חוזה עם עורך בקשה",order:39,phase:"התקשרות ספקים",deps:["שליחת הצעת מחיר חתומה לספקים"]},
  {id:"2097788753",name:"הזנת חוזה עם שרטט",order:40,phase:"התקשרות ספקים",deps:["שליחת הצעת מחיר חתומה לספקים"]},
  {id:"2097789412",name:"הזנת חוזה עם מהנדס",order:41,phase:"התקשרות ספקים",deps:["שליחת הצעת מחיר חתומה לספקים"]},
  {id:"2003933263",name:"פתיחת פקודה לתשלום שלב א' שרטטת",order:42,phase:"התקשרות ספקים",deps:["הזנת חוזה עם שרטט"]},
  {id:"2003933275",name:"פתיחת פקודת לתשלום שלב א' לעורך בקשה",order:43,phase:"התקשרות ספקים",deps:["הזנת חוזה עם עורך בקשה"]},
  {id:"2003933351",name:"שליחת חומרים לשרטט",order:44,phase:"גרמושקה",deps:["שליחת הצעת מחיר חתומה לספקים"]},
  {id:"2003933374",name:"קבלת גרמושקה מוכנה",order:45,phase:"גרמושקה",deps:["שליחת חומרים לשרטט"]},
  {id:"2024081487",name:"בקרת איכות הגרמושקה המוכנה",order:46,phase:"גרמושקה",deps:["קבלת גרמושקה מוכנה"]},
  {id:"2024090697",name:"החזרה לשרטט לתיקוני גרמושקה",order:47,phase:"גרמושקה",deps:["בקרת איכות הגרמושקה המוכנה"]},
  {id:"2024092913",name:"קבלת גרמושקה מתוקנת משרטט",order:48,phase:"גרמושקה",deps:["החזרה לשרטט לתיקוני גרמושקה"]},
  {id:"2024096456",name:"וידוא תיקוני שרטט על גרמושקה",order:49,phase:"גרמושקה",deps:["קבלת גרמושקה מתוקנת משרטט"]},
  {id:"2024077976",name:"שליחת גרמושקה למנהל מחלקה",order:50,phase:"גרמושקה",deps:["וידוא תיקוני שרטט על גרמושקה"]},
  {id:"2024079499",name:"בקרת מנהל על גרמושקה מוכנה",order:51,phase:"גרמושקה",deps:["שליחת גרמושקה למנהל מחלקה"]},
  {id:"2525380513",name:"בקרת מחלקה מקצועית על גרמושקה",order:51.1,phase:"גרמושקה",deps:["שליחת גרמושקה למנהל מחלקה"]},
  {id:"2003933419",name:"קביעת פגישה לאישור לקוח על גרמושקה",order:52,phase:"גרמושקה",deps:["וידוא תיקוני שרטט על גרמושקה"]},
  {id:"2024099248",name:"פגישת אישור תוכניות עם לקוח",order:53,phase:"גרמושקה",deps:["קביעת פגישה לאישור לקוח על גרמושקה"]},
  {id:"2024114409",name:"פגישת קבלת פרויקט ממחלקת תכנון והלקוח",order:54,phase:"גרמושקה",deps:["קביעת פגישה לאישור לקוח על גרמושקה"]},
  {id:"2024128062",name:"אישור סופי מלקוח על סיום שלב תכנון",order:55,phase:"גרמושקה",deps:["פגישת אישור תוכניות עם לקוח"]},
  {id:"2003933436",name:"שליחת בקשה לתקבול שלב ב' מלקוח",order:56,phase:"גרמושקה",deps:["אישור סופי מלקוח על סיום שלב תכנון"]},
  {id:"2003933454",name:"פתיחת תשלום שלב ב' שרטטת",order:57,phase:"גרמושקה",deps:["שליחת בקשה לתקבול שלב ב' מלקוח"]},
  {id:"2092492265",name:"פתיחת תשלום שלב ב' עורך בקשה",order:58,phase:"גרמושקה",deps:["שליחת בקשה לתקבול שלב ב' מלקוח"]},
  {id:"2003933473",name:"הטמעה עורכי בקשה על הגרמושקה",order:59,phase:"גרמושקה",deps:["פתיחת תשלום שלב ב' שרטטת"]},
  {id:"2003933479",name:"תיקון הערות בהתאם לדרישות עורך הבקשה",order:60,phase:"גרמושקה",deps:["הטמעה עורכי בקשה על הגרמושקה"]},
  {id:"2003933486",name:"קבלת תוכניות מוכנות להגשה",order:61,phase:"גרמושקה",deps:[]},
  {id:"2698863769",name:"קביעת פגישת אפיון מהנדס לקוח",order:61.1,phase:"גרמושקה",deps:[]},
  {id:"2024193959",name:"שליחת התוכניות למתכנן האיזורי משרד החקלאות",order:62,phase:"חתימות",deps:["אישור סופי מלקוח על סיום שלב תכנון"]},
  {id:"2024201420",name:"תיאום פגישה בשטח עם המתכנן האיזורי",order:63,phase:"חתימות",deps:["שליחת התוכניות למתכנן האיזורי משרד החקלאות"]},
  {id:"2024222751",name:"פגישה בשטח עם מתכנן משרד החלקאות",order:64,phase:"חתימות",deps:["תיאום פגישה בשטח עם המתכנן האיזורי"]},
  {id:"2024203914",name:"איסוף חומרים בהתאם לדרישות מתכנן משרד החקלאות",order:65,phase:"חתימות",deps:["תיאום פגישה בשטח עם המתכנן האיזורי"]},
  {id:"2024208715",name:"שליחת בקשה לאישור עקרוני משרד החקלאות",order:66,phase:"חתימות",deps:["איסוף חומרים בהתאם לדרישות מתכנן משרד החקלאות"]},
  {id:"2024202415",name:"קבלת אישור עקרוני ממשרד החקלאות",order:67,phase:"חתימות",deps:["שליחת בקשה לאישור עקרוני משרד החקלאות"]},
  {id:"2003933494",name:"שיחה עם הלקוח להתחלת שלב רישוי",order:68,phase:"חתימות",deps:["קבלת תוכניות מוכנות להגשה"]},
  {id:"2024177039",name:"שליחה למכון העתקות",order:69,phase:"חתימות",deps:["שיחה עם הלקוח להתחלת שלב רישוי"]},
  {id:"2003933526",name:"קבלת תוכניות חתומות מהלקוח",order:70,phase:"חתימות",deps:["שליחה למכון העתקות"]},
  {id:"2003933569",name:"שליחה פיזית לחתימה במשרד החקלאות",order:71,phase:"חתימות",deps:["קבלת תוכניות חתומות מהלקוח"]},
  {id:"2024233619",name:"קבלת חתימה ממשרד החקלאות",order:72,phase:"חתימות",deps:["שליחה פיזית לחתימה במשרד החקלאות"]},
  {id:"2003933594",name:"סריקת תוכניות חתומות 1",order:73,phase:"חתימות",deps:["קבלת חתימה ממשרד החקלאות"]},
  {id:"2003933629",name:"הגשה לועדה מקומית",order:74,phase:"חתימות",deps:["קבלת תיק מידע","סריקת תוכניות חתומות 1"]},
  {id:"2003933668",name:"הוצאת שובר אגרת פקדון לתשלום",order:75,phase:"תנאים מקדימים",deps:["הגשה לועדה מקומית"]},
  {id:"2003933703",name:"הוספת אבני דרך בהתאם לגליון דרישות תיק המידע בתוכנה",order:76,phase:"תנאים מקדימים",deps:["קבלת תיק מידע","אישור סופי מלקוח על סיום שלב תכנון"]},
  {id:"2003933730",name:"שליחה ללקוח לתשלום אגרה 20%",order:77,phase:"תנאים מקדימים",deps:["הוצאת שובר אגרת פקדון לתשלום"]},
  {id:"2003933780",name:"קבלה מלקוח ששילם אגרה",order:79,phase:"תנאים מקדימים",deps:["שליחה ללקוח לתשלום אגרה 20%"]},
  {id:"2003933798",name:"מילוי דרישות תנאים מקדימים",order:80,phase:"תנאים מקדימים",deps:["שיחה עם הלקוח להתחלת שלב רישוי","קבלת תיק מידע"]},
  {id:"2003934040",name:"שליחה לעורך הבקשה במייל את כלל המסמכים",order:81,phase:"תנאים מקדימים",deps:["מילוי דרישות תנאים מקדימים"]},
  {id:"2003934051",name:"קבלת אסמתכאת הזנה מעורך הבקשה",order:82,phase:"תנאים מקדימים",deps:["שליחה לעורך הבקשה במייל את כלל המסמכים"]},
  {id:"2003933753",name:"הגשת חשבון שלב ג'",order:78,phase:"תנאים מקדימים",deps:["הגשה לועדה מקומית"]},
  {id:"2003934098",name:"קבלת אישור על סיום תנאים מקדימים והתחלת בקרה מרחבית",order:83,phase:"תנאים מקדימים",deps:["קבלת אסמתכאת הזנה מעורך הבקשה"]},
  {id:"2003935357",name:"שליחת פניה לועדה המקומית - בקרה מרחבית",order:96,phase:"בקרה מרחבית",deps:[]},
  {id:"2003935374",name:"קבלת התייחסות הוועדה המקומית - בקרה מרחבית",order:97,phase:"בקרה מרחבית",deps:["קבלת אישור על סיום תנאים מקדימים והתחלת בקרה מרחבית"]},
  {id:"2003935390",name:"העברה לשרטטת לתיקון",order:98,phase:"בקרה מרחבית",deps:["קבלת התייחסות הוועדה המקומית - בקרה מרחבית"]},
  {id:"2003935408",name:"קבלת חומרים מהשרטטת",order:99,phase:"בקרה מרחבית",deps:["העברה לשרטטת לתיקון"]},
  {id:"2003935430",name:"העברה לעורך הבקשה להזנה ברישו זמין",order:100,phase:"בקרה מרחבית",deps:["קבלת חומרים מהשרטטת"]},
  {id:"2003935451",name:"אישור הזנה למערכת רישוי זמין",order:101,phase:"בקרה מרחבית",deps:["העברה לעורך הבקשה להזנה ברישו זמין"]},
  {id:"2029829160",name:"אישור תקינות בקרה מרחבית",order:102,phase:"בקרה מרחבית",deps:["אישור הזנה למערכת רישוי זמין"]},
  {id:"2003935465",name:"שיבוץ לוועדת רישוי/משנה",order:103,phase:"בקרה מרחבית",deps:["אישור תקינות בקרה מרחבית"]},
  {id:"2092493194",name:"קבלת החלטת וועדה",order:104,phase:"בקרה מרחבית",deps:[]},
  {id:"2003938274",name:"הזנת משימות בתוכנה מגליון דרישות החלטת וועדה",order:104.1,phase:"יועצים",deps:[]},
  {id:"2003935485",name:"פתיחת פקודת תשלום שלב ג' לספק עורך בקשה",order:105,phase:"בקרה מרחבית",deps:[]},
  {id:"2003935501",name:"הכנת הצעת מחיר יועצים ללקוח",order:106,phase:"יועצים",deps:[]},
  {id:"2003935607",name:"אישור מנהל מחלקה על הצעת מחיר יועצים",order:107,phase:"יועצים",deps:[]},
  {id:"2003935615",name:"אישור לקוח על הצעת מחיר יועצים",order:108,phase:"יועצים",deps:[]},
  {id:"2003935900",name:"הגשת חשבון יועצים שלב א'",order:109,phase:"יועצים",deps:[]},
  {id:"2003935925",name:"התקשרות עם יועץ מיגון",order:110,phase:"יועצים",deps:[]},
  {id:"2003937201",name:"קבלת תוכנית מיגון",order:111,phase:"יועצים",deps:[]},
  {id:"2003935985",name:"התקשרות עם יועץ בטיחות",order:115,phase:"יועצים",deps:["קבלת אפיון מים"]},
  {id:"2003937410",name:"קבלת תוכנית בטיחות",order:116,phase:"יועצים",deps:[]},
  {id:"2003936280",name:"התקשרות עם יועץ סניטרי",order:119,phase:"יועצים",deps:[]},
  {id:"2003937256",name:"קבלת תוכנית סניטרית",order:120,phase:"יועצים",deps:[]},
  {id:"2003937273",name:"קבלת פרשה טכנית",order:121,phase:"יועצים",deps:[]},
  {id:"2003936366",name:"התקשרות עם יועץ ניקוז",order:123,phase:"יועצים",deps:[]},
  {id:"2003937318",name:"קבלת תוכנית ניקוז",order:124,phase:"יועצים",deps:[]},
  {id:"2003936457",name:"התקשרות עם יועץ קרקע",order:125,phase:"יועצים",deps:[]},
  {id:"2003937341",name:"קבלת דוח קרקע",order:126,phase:"יועצים",deps:[]},
  {id:"2003936534",name:"התקשרות עם יועץ תנועה",order:127,phase:"יועצים",deps:[]},
  {id:"2003937362",name:"קבלת תוכנית תנועה",order:128,phase:"יועצים",deps:[]},
  {id:"2003936813",name:"התקשרות עם יועץ נגישות",order:129,phase:"יועצים",deps:[]},
  {id:"2003937382",name:"קבלת תוכנית נגישות",order:130,phase:"יועצים",deps:[]},
  {id:"2003936885",name:"התקשרות עם מעבדה לאפיון מים",order:139,phase:"יועצים",deps:[]},
  {id:"2003937229",name:"קבלת אפיון מים",order:140,phase:"יועצים",deps:[]},
  {id:"2003937893",name:"אישור לקוח על תוכניות יועצים",order:142,phase:"יועצים",deps:["קבלת אפיון מים","קבלת תוכנית נגישות","קבלת תוכנית תנועה","קבלת דוח קרקע","קבלת תוכנית ניקוז","קבלת תוכנית סניטרית","קבלת תוכנית בטיחות","קבלת תוכנית מיגון"]},
  {id:"2003938074",name:"שליחה בקשה למהנדס להכנת תוכנית ממד",order:143,phase:"יועצים",deps:[]},
  {id:"2003938250",name:'קבלת תוכניות ממ"ד ממהנדס',order:144,phase:"יועצים",deps:[]},
  {id:"2003938259",name:"פתיחת בקשה בפיקוד העורף",order:145,phase:"יועצים",deps:[]},
  {id:"2003938268",name:"קבלת אישור פיקוד העורף",order:146,phase:"יועצים",deps:[]},
  {id:"2003937434",name:"שליחת בקשה לעבודה על תוכניות ביצוע",order:147,phase:"יועצים",deps:[]},
  {id:"2003937450",name:"שליחת חומרים למהנדס",order:148,phase:"יועצים",deps:[]},
  {id:"2003937471",name:"קבלת תוכניות ביצוע",order:148.1,phase:"יועצים",deps:[]},
  {id:"2003937490",name:"דיווח למחלקת ביצוע",order:149,phase:"יועצים",deps:[]},
  {id:"2003934111",name:'תיק הגשה לרמ"י',order:150,phase:'רמ"י',deps:[]},
  {id:"2003935108",name:"הדפסה וריכוז לתיק הגשה",order:151,phase:'רמ"י',deps:[]},
  {id:"2003935158",name:'פגישת הכנה להגשה והחתמת לקוח על תיק הגשה',order:152,phase:'רמ"י',deps:[]},
  {id:"2003935188",name:'החתמת עורך דין על תיק הגשה',order:153,phase:'רמ"י',deps:[]},
  {id:"2003935210",name:'הגשה לרמ"י',order:154,phase:'רמ"י',deps:[]},
  {id:"2003935239",name:"הזמנת פיקוח במידת הצורך",order:155,phase:'רמ"י',deps:[]},
  {id:"2003935225",name:"שליחת טופס חריגות לאישור מחלקת פיקוח - אופ'",order:156,phase:'רמ"י',deps:[]},
  {id:"2003935253",name:"הפקת שובר דמי שימוש/דמי היתר - אופ'",order:157,phase:'רמ"י',deps:[]},
  {id:"2003935298",name:"תשלום שובר",order:158,phase:'רמ"י',deps:[]},
  {id:"2003935316",name:"חתימה על תוכניות",order:159,phase:'רמ"י',deps:[]},
  {id:"2003935338",name:"סריקת תוכניות חתומות 2",order:160,phase:'רמ"י',deps:[]},
  {id:"2029746063",name:"עדכון מחלקת מכירות במידה ונדרש דיווח למס רכישה",order:161,phase:'רמ"י',deps:[]},
  {id:"2003938305",name:"התקשרות עם אתר פסולת",order:165,phase:"יועצים",deps:[]},
  {id:"2003938318",name:"התקשרות עם מעבדה לבדיקות מעבדה",order:166,phase:"יועצים",deps:[]},
  {id:"2003938354",name:"הגשת תוכנית לכבאות",order:168,phase:"גופים שונים",deps:["קבלת החלטת וועדה","קבלת תוכנית בטיחות"]},
  {id:"2003938368",name:"קבלת אישור כבאות",order:169,phase:"גופים שונים",deps:["הגשת תוכנית לכבאות"]},
  {id:"2003938377",name:"הדפסה ושליחת תוכנית סניטרית למשרד הבריאות",order:170,phase:"גופים שונים",deps:["קבלת החלטת וועדה","קבלת פרשה טכנית","קבלת תוכנית סניטרית"]},
  {id:"2003938386",name:"קבלת אישור קליטה - משרד הבריאות",order:171,phase:"גופים שונים",deps:["הדפסה ושליחת תוכנית סניטרית למשרד הבריאות"]},
  {id:"2003938406",name:"קבלת אישור משרד הבריאות",order:172,phase:"גופים שונים",deps:["קבלת אישור קליטה - משרד הבריאות"]},
  {id:"2003938418",name:"הדפסה ושליחת תוכנית סניטרית לאיגוד ערים",order:173,phase:"גופים שונים",deps:["קבלת החלטת וועדה","קבלת תוכנית סניטרית","קבלת פרשה טכנית"]},
  {id:"2003938435",name:"קבלת אישור קליטה באיגוד ערים",order:174,phase:"גופים שונים",deps:["הדפסה ושליחת תוכנית סניטרית לאיגוד ערים"]},
  {id:"2003938450",name:"קבלת אישור איגוד ערים",order:175,phase:"גופים שונים",deps:["קבלת אישור קליטה באיגוד ערים"]},
  {id:"2003938471",name:"הדפסה ושליחת תוכנית סניטרית לאיכות סביבה",order:176,phase:"גופים שונים",deps:["קבלת החלטת וועדה","קבלת פרשה טכנית","קבלת תוכנית סניטרית"]},
  {id:"2003938496",name:"קבלת אישור קליטה באיכות הסביבה",order:177,phase:"גופים שונים",deps:["הדפסה ושליחת תוכנית סניטרית לאיכות סביבה"]},
  {id:"2003938511",name:"קבלת אישור איכות סביבה",order:178,phase:"גופים שונים",deps:["קבלת אישור קליטה באיכות הסביבה"]},
  {id:"2003938534",name:"פניה לעורך הבקשה שיגיש לועדה מקומית",order:179,phase:"סיום בקרת תכן",deps:[]},
  {id:"2003938544",name:"קבלת אישור הזנה",order:180,phase:"סיום בקרת תכן",deps:["פניה לעורך הבקשה שיגיש לועדה מקומית"]},
  {id:"2003938564",name:"קבלת אישור סופי מהוועדה",order:181,phase:"סיום בקרת תכן",deps:["קבלת אישור הזנה"]},
  {id:"2003938577",name:"קבלת שובר אגרות לתשלום",order:182,phase:"תשלומי אגרות",deps:["קבלת אישור סופי מהוועדה"]},
  {id:"2003938616",name:"קבלת היטלים",order:183,phase:"תשלומי אגרות",deps:["קבלת שובר אגרות לתשלום"]},
  {id:"2003938626",name:"קבלת מכתב ערבות",order:184,phase:"תשלומי אגרות",deps:["קבלת היטלים"]},
  {id:"2003938635",name:"הצגת תחשיבי היטלים ואגרות למנהל מחלקה",order:185,phase:"תשלומי אגרות",deps:["קבלת מכתב ערבות"]},
  {id:"2003938653",name:"עדכון לקוח באגרות",order:186,phase:"תשלומי אגרות",deps:["הצגת תחשיבי היטלים ואגרות למנהל מחלקה"]},
  {id:"2003938661",name:"קבלת אישור תשלום אגרות",order:187,phase:"תשלומי אגרות",deps:["עדכון לקוח באגרות"]},
  {id:"2003938672",name:"קבלת מסמך היתר",order:188,phase:"הפקת מסמך",deps:["קבלת אישור תשלום אגרות"]},
  {id:"2003938688",name:"הגשת חשבון שלב ד'",order:189,phase:"הפקת מסמך",deps:["קבלת מסמך היתר"]},
  {id:"2092493775",name:"פתיחת פקודת תשלום שלב ד' לספק עורך בקשה",order:190,phase:"הפקת מסמך",deps:["הגשת חשבון שלב ד'"]},
];

const PHASE_CONFIG = {
  "קליטה":            { color:"#6366F1", icon:"📥" },
  "מדידה":            { color:"#10B981", icon:"📐" },
  "היתרים":           { color:"#F97316", icon:"📋" },
  "תיק מידע":         { color:"#F59E0B", icon:"🗂" },
  "קומפילציה":        { color:"#8B5CF6", icon:"⚙️" },
  "גרמושקה":          { color:"#EC4899", icon:"📝" },
  "התקשרות ספקים":    { color:"#14B8A6", icon:"🤝" },
  "חתימות":           { color:"#06B6D4", icon:"✍️" },
  "תנאים מקדימים":   { color:"#EF4444", icon:"✅" },
  "בקרה מרחבית":     { color:"#3B82F6", icon:"🔍" },
  "יועצים":           { color:"#84CC16", icon:"👷" },
  'רמ"י':             { color:"#D97706", icon:"🏛" },
  "גופים שונים":      { color:"#7C3AED", icon:"🏢" },
  "סיום בקרת תכן":   { color:"#059669", icon:"🎯" },
  "תשלומי אגרות":    { color:"#DC2626", icon:"💳" },
  "הפקת מסמך":       { color:"#1D4ED8", icon:"📄" },
};

const PHASE_ORDER = Object.keys(PHASE_CONFIG);

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return r ? `${parseInt(r[1],16)},${parseInt(r[2],16)},${parseInt(r[3],16)}` : "99,102,241";
}

const totalTasks = RAW_DATA.length;
const totalDepsCount = RAW_DATA.reduce((a, i) => a + i.deps.length, 0);
const phaseCounts = {};
PHASE_ORDER.forEach(p => { phaseCounts[p] = RAW_DATA.filter(i => i.phase === p).length; });
const maxPhaseCount = Math.max(...Object.values(phaseCounts));

// ── Sub-components ─────────────────────────────────────────────────────────

function Pill({ color, children }) {
  return (
    <span style={{
      display:"inline-flex", alignItems:"center",
      fontSize:10, fontWeight:700,
      padding:"2px 8px", borderRadius:20,
      background:`rgba(${hexToRgb(color)},0.15)`,
      color, border:`1px solid rgba(${hexToRgb(color)},0.35)`,
    }}>{children}</span>
  );
}

function PhaseCard({ phase, items, cfg, isActive, dimmed, highlighted, onClick }) {
  const count = items.length;
  const barPct = Math.round((count / maxPhaseCount) * 100);
  const withDeps = items.filter(i => i.deps.length > 0).length;
  const rgb = hexToRgb(cfg.color);

  let border = `1.5px solid rgba(${rgb},0.22)`;
  let bg = "rgba(13,24,41,0.75)";
  let shadow = "none";
  let opacity = dimmed ? 0.22 : 1;

  if (isActive) {
    border = `2px solid ${cfg.color}`;
    bg = `rgba(${rgb},0.13)`;
    shadow = `0 0 28px rgba(${rgb},0.3), 0 4px 20px rgba(0,0,0,0.5)`;
    opacity = 1;
  } else if (highlighted) {
    border = `2px solid rgba(${rgb},0.55)`;
    bg = `rgba(${rgb},0.07)`;
    opacity = 1;
  }

  return (
    <div onClick={onClick} style={{
      background:bg, border, borderRadius:14,
      padding:"14px 16px", cursor:"pointer",
      opacity, transition:"all 0.2s ease",
      boxShadow:shadow, position:"relative", overflow:"hidden",
    }}>
      {/* Top accent bar */}
      <div style={{
        position:"absolute", top:0, right:0, left:0, height:3,
        background:`linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
        opacity: isActive ? 1 : 0.45,
      }}/>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:18 }}>{cfg.icon}</span>
        <span style={{ fontWeight:800, fontSize:13, color:cfg.color, flex:1, lineHeight:1.2 }}>{phase}</span>
        <span style={{ fontSize:24, fontWeight:900, color:cfg.color, lineHeight:1 }}>{count}</span>
      </div>

      {/* Progress bar */}
      <div style={{
        height:5, borderRadius:3, background:"rgba(255,255,255,0.05)",
        marginBottom:10, overflow:"hidden",
      }}>
        <div style={{
          width:`${barPct}%`, height:"100%", borderRadius:3,
          background:`linear-gradient(90deg, rgba(${rgb},0.45), ${cfg.color})`,
        }}/>
      </div>

      {/* Preview tasks */}
      <div style={{ marginBottom:8 }}>
        {items.slice(0,3).map(t => (
          <div key={t.id} style={{
            fontSize:11, color:"#94A3B8", lineHeight:1.4,
            padding:"1px 0", display:"flex", gap:5, alignItems:"baseline",
          }}>
            <span style={{ color:cfg.color, opacity:0.55, fontSize:9 }}>▸</span>
            <span style={{
              overflow:"hidden", textOverflow:"ellipsis",
              whiteSpace:"nowrap", flex:1, minWidth:0,
            }}>{t.name}</span>
          </div>
        ))}
        {count > 3 && (
          <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>+ {count-3} משימות נוספות</div>
        )}
      </div>

      {/* Badges */}
      <div style={{ display:"flex", gap:4, flexWrap:"wrap" }}>
        <Pill color={cfg.color}>{count} משימות</Pill>
        {withDeps > 0 && <Pill color="#4ADE80">{withDeps} תלויות</Pill>}
      </div>
    </div>
  );
}

function TaskRow({ item, state, cfg, onClick }) {
  let bg = "transparent";
  let accent = "3px solid transparent";
  if (state === "selected") { bg=`rgba(${hexToRgb(cfg.color)},0.18)`; accent=`3px solid ${cfg.color}`; }
  else if (state === "dep")  { bg="rgba(74,222,128,0.07)";  accent="3px solid #4ADE80"; }
  else if (state === "dependent") { bg="rgba(248,113,113,0.07)"; accent="3px solid #F87171"; }

  return (
    <div onClick={onClick} style={{
      display:"grid", gridTemplateColumns:"36px 1fr auto",
      gap:8, alignItems:"center",
      padding:"7px 12px",
      background:bg, borderRight:accent,
      cursor:"pointer", transition:"background 0.15s",
      opacity: state === "muted" ? 0.25 : 1,
    }}>
      <span style={{ fontSize:10, fontWeight:800, color:cfg.color, textAlign:"center", opacity:0.8 }}>
        {item.order}
      </span>
      <span style={{
        fontSize:12.5, color: state==="muted" ? "#475569" : "#CBD5E1",
        fontWeight:500, lineHeight:1.3,
      }}>{item.name}</span>
      {item.deps.length > 0 && (
        <span style={{
          fontSize:9, padding:"1px 5px", borderRadius:6,
          background:"rgba(74,222,128,0.12)", color:"#4ADE80", fontWeight:700,
        }}>↑{item.deps.length}</span>
      )}
    </div>
  );
}

// ── Main app ───────────────────────────────────────────────────────────────

export default function App() {
  const [activePhase, setActivePhase] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const byPhase = useMemo(() => {
    const map = {};
    PHASE_ORDER.forEach(p => {
      map[p] = RAW_DATA.filter(i => i.phase === p).sort((a,b) => a.order - b.order);
    });
    return map;
  }, []);

  const byName = useMemo(() => {
    const m = {};
    RAW_DATA.forEach(i => { m[i.name] = i; });
    return m;
  }, []);

  const resolveDepIds = useCallback((deps) => {
    return deps.map(d => {
      const exact = byName[d];
      if (exact) return exact.id;
      const partial = RAW_DATA.find(i => i.name.includes(d) || d.includes(i.name.substring(0,10)));
      return partial?.id;
    }).filter(Boolean);
  }, [byName]);

  const highlights = useMemo(() => {
    if (!selectedTask) return { deps: new Set(), dependents: new Set() };
    const item = RAW_DATA.find(i => i.id === selectedTask);
    if (!item) return { deps: new Set(), dependents: new Set() };
    return {
      deps: new Set(resolveDepIds(item.deps)),
      dependents: new Set(RAW_DATA.filter(i => resolveDepIds(i.deps).includes(selectedTask)).map(i => i.id)),
    };
  }, [selectedTask, resolveDepIds]);

  const selectedItem = RAW_DATA.find(i => i.id === selectedTask);

  const highlightedPhases = useMemo(() => {
    if (!selectedTask) return new Set();
    const s = new Set();
    RAW_DATA.forEach(i => {
      if (highlights.deps.has(i.id) || highlights.dependents.has(i.id) || i.id === selectedTask) s.add(i.phase);
    });
    return s;
  }, [selectedTask, highlights]);

  const getTaskState = (item) => {
    if (!selectedTask) return "normal";
    if (item.id === selectedTask) return "selected";
    if (highlights.deps.has(item.id)) return "dep";
    if (highlights.dependents.has(item.id)) return "dependent";
    return "muted";
  };

  const activeCfg = activePhase ? PHASE_CONFIG[activePhase] : null;
  const detailItems = activePhase ? byPhase[activePhase] : [];

  return (
    <div dir="rtl" style={{
      fontFamily:"'Segoe UI', 'David Libre', Arial, sans-serif",
      background:"linear-gradient(160deg, #060B18 0%, #0D1829 50%, #060B18 100%)",
      minHeight:"100vh",
      color:"#E2E8F0",
    }}>

      {/* ── HERO ── */}
      <div style={{
        background:"linear-gradient(180deg,rgba(99,102,241,0.1) 0%,transparent 100%)",
        borderBottom:"1px solid rgba(255,255,255,0.05)",
        padding:"36px 28px 28px",
        textAlign:"center",
      }}>
        <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
          <span style={{
            fontSize:10, fontWeight:800, letterSpacing:"0.2em",
            padding:"4px 16px", borderRadius:20,
            background:"rgba(99,102,241,0.18)",
            border:"1px solid rgba(129,140,248,0.4)",
            color:"#A5B4FC", textTransform:"uppercase",
          }}>תהליך הרישוי · מפת הדרך</span>
        </div>

        <h1 style={{
          margin:"0 0 8px",
          fontSize:"clamp(24px,5vw,44px)",
          fontWeight:900, lineHeight:1.15,
          background:"linear-gradient(135deg,#E0E7FF 0%,#A5B4FC 40%,#C084FC 70%,#F472B6 100%)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        }}>
          תהליך הוצאת היתר בניה
        </h1>
        <p style={{ margin:"0 0 28px", color:"#64748B", fontSize:14, fontWeight:500 }}>
          מקליטת פרויקט ועד הפקת מסמך ההיתר — כל שלב, כל תלות
        </p>

        {/* Stats row */}
        <div style={{ display:"flex", justifyContent:"center", gap:14, flexWrap:"wrap" }}>
          {[
            { value:totalTasks,  label:"משימות",    color:"#818CF8" },
            { value:PHASE_ORDER.length, label:"שלבים", color:"#C084FC" },
            { value:totalDepsCount, label:"תלויות",  color:"#F472B6" },
            { value:RAW_DATA.filter(i=>i.deps.length===0).length, label:"מקביליות", color:"#34D399" },
          ].map(s => (
            <div key={s.label} style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              padding:"14px 22px", borderRadius:16,
              background:`rgba(${hexToRgb(s.color)},0.1)`,
              border:`1px solid rgba(${hexToRgb(s.color)},0.25)`,
              minWidth:88,
            }}>
              <span style={{ fontSize:30, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</span>
              <span style={{ fontSize:11, color:"#64748B", fontWeight:600, marginTop:4 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"24px", maxWidth:1500, margin:"0 auto" }}>

        <BitcoinChart />

        {/* ── SECTION LABEL ── */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
          <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.05)" }}/>
          <span style={{ fontSize:11, color:"#475569", fontWeight:700, letterSpacing:"0.1em" }}>
            לחץ על שלב לפירוט · לחץ על משימה לתלויות
          </span>
          <div style={{ height:1, flex:1, background:"rgba(255,255,255,0.05)" }}/>
        </div>

        {/* ── PHASE GRID ── */}
        <div style={{
          display:"grid",
          gridTemplateColumns:"repeat(auto-fill, minmax(195px, 1fr))",
          gap:11, marginBottom:26,
        }}>
          {PHASE_ORDER.map((phase, idx) => {
            const cfg = PHASE_CONFIG[phase];
            return (
              <div key={phase} style={{ position:"relative" }}>
                {/* Step badge */}
                <div style={{
                  position:"absolute", top:-9, right:12, zIndex:2,
                  fontSize:9, fontWeight:800,
                  background:"#0D1829",
                  border:`1px solid rgba(${hexToRgb(cfg.color)},0.4)`,
                  color:cfg.color,
                  borderRadius:6, padding:"1px 6px",
                }}>{idx+1}</div>
                <PhaseCard
                  phase={phase}
                  items={byPhase[phase]}
                  cfg={cfg}
                  isActive={activePhase === phase}
                  dimmed={!!activePhase && activePhase !== phase}
                  highlighted={selectedTask ? highlightedPhases.has(phase) : false}
                  onClick={() => {
                    setActivePhase(activePhase === phase ? null : phase);
                    setSelectedTask(null);
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ── DETAIL DRAWER ── */}
        {activePhase && activeCfg && (
          <div style={{
            background:"rgba(10,18,32,0.97)",
            border:`1.5px solid rgba(${hexToRgb(activeCfg.color)},0.35)`,
            borderRadius:16, overflow:"hidden",
            boxShadow:`0 0 50px rgba(${hexToRgb(activeCfg.color)},0.1)`,
            marginBottom:28,
          }}>
            {/* Drawer header */}
            <div style={{
              padding:"14px 20px",
              background:`linear-gradient(135deg,rgba(${hexToRgb(activeCfg.color)},0.14),transparent)`,
              borderBottom:`1px solid rgba(${hexToRgb(activeCfg.color)},0.18)`,
              display:"flex", alignItems:"center", gap:12, flexWrap:"wrap",
            }}>
              <span style={{ fontSize:22 }}>{activeCfg.icon}</span>
              <div>
                <div style={{ fontWeight:800, fontSize:16, color:activeCfg.color }}>{activePhase}</div>
                <div style={{ fontSize:11, color:"#64748B", marginTop:1 }}>
                  {detailItems.length} משימות · לחץ על משימה להצגת תלויות
                </div>
              </div>
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginRight:"auto" }}>
                <Pill color={activeCfg.color}>{detailItems.length} משימות</Pill>
                <Pill color="#4ADE80">{detailItems.filter(i=>i.deps.length>0).length} עם תלויות</Pill>
              </div>
              <button onClick={() => { setActivePhase(null); setSelectedTask(null); }} style={{
                padding:"5px 12px", borderRadius:8,
                border:"1px solid rgba(239,68,68,0.35)",
                background:"rgba(239,68,68,0.1)", color:"#F87171",
                fontSize:12, cursor:"pointer", fontWeight:700,
              }}>✕</button>
            </div>

            <div style={{
              display:"grid",
              gridTemplateColumns: selectedItem ? "1fr 320px" : "1fr",
            }}>
              {/* Task list */}
              <div style={{ maxHeight:400, overflowY:"auto" }}>
                <div style={{
                  display:"grid", gridTemplateColumns:"36px 1fr auto",
                  gap:8, padding:"7px 12px",
                  background:"rgba(255,255,255,0.03)",
                  borderBottom:"1px solid rgba(255,255,255,0.05)",
                  fontSize:10, color:"#475569", fontWeight:700,
                }}>
                  <span style={{ textAlign:"center" }}>#</span><span>משימה</span><span>תלויות</span>
                </div>
                {detailItems.map(item => (
                  <TaskRow
                    key={item.id} item={item}
                    state={getTaskState(item)}
                    cfg={PHASE_CONFIG[item.phase]}
                    onClick={() => setSelectedTask(item.id === selectedTask ? null : item.id)}
                  />
                ))}
              </div>

              {/* Dependency side panel */}
              {selectedItem && (() => {
                const dependents = RAW_DATA.filter(i => resolveDepIds(i.deps).includes(selectedTask));
                return (
                  <div style={{
                    borderRight:"1px solid rgba(255,255,255,0.05)",
                    padding:"16px", background:"rgba(0,0,0,0.25)",
                  }}>
                    <div style={{ fontSize:9, color:"#818CF8", fontWeight:800, marginBottom:3 }}>משימה נבחרת</div>
                    <div style={{ fontSize:14, fontWeight:700, color:"#E2E8F0", marginBottom:2, lineHeight:1.35 }}>
                      {selectedItem.name}
                    </div>
                    <div style={{ fontSize:11, color:"#64748B", marginBottom:14 }}>
                      שלב: {selectedItem.phase} · סדר: {selectedItem.order}
                    </div>

                    {selectedItem.deps.length > 0 && (
                      <div style={{ marginBottom:14 }}>
                        <div style={{ fontSize:9, color:"#4ADE80", fontWeight:800, marginBottom:5 }}>
                          ↑ תנאים מקדימים ({selectedItem.deps.length})
                        </div>
                        {selectedItem.deps.map((d,i) => (
                          <div key={i} style={{
                            fontSize:11, color:"#86EFAC", marginBottom:3,
                            padding:"4px 10px", borderRadius:6,
                            background:"rgba(74,222,128,0.07)",
                            border:"1px solid rgba(74,222,128,0.18)",
                            lineHeight:1.3,
                          }}>{d}</div>
                        ))}
                      </div>
                    )}

                    {dependents.length > 0 && (
                      <div>
                        <div style={{ fontSize:9, color:"#F87171", fontWeight:800, marginBottom:5 }}>
                          ↓ ממתינות לסיום ({dependents.length})
                        </div>
                        {dependents.map(dep => (
                          <div key={dep.id} style={{
                            fontSize:11, color:"#FCA5A5", marginBottom:3,
                            padding:"4px 10px", borderRadius:6,
                            background:"rgba(248,113,113,0.07)",
                            border:"1px solid rgba(248,113,113,0.18)",
                            lineHeight:1.3,
                          }}>{dep.name}</div>
                        ))}
                      </div>
                    )}

                    {selectedItem.deps.length === 0 && dependents.length === 0 && (
                      <div style={{
                        fontSize:12, color:"#475569",
                        padding:"12px", borderRadius:8,
                        background:"rgba(255,255,255,0.02)",
                        border:"1px dashed rgba(255,255,255,0.07)",
                        textAlign:"center",
                      }}>משימה עצמאית — אין תלויות</div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── BAR CHART ── */}
        <div style={{
          background:"rgba(13,24,41,0.8)",
          border:"1px solid rgba(255,255,255,0.06)",
          borderRadius:16, padding:"22px",
          marginBottom:24,
        }}>
          <div style={{ marginBottom:16, display:"flex", alignItems:"baseline", gap:10 }}>
            <h2 style={{ margin:0, fontSize:15, fontWeight:800, color:"#CBD5E1" }}>
              כמות משימות לפי שלב
            </h2>
            <span style={{ fontSize:11, color:"#475569" }}>לחץ לסינון</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {PHASE_ORDER.map(phase => {
              const cfg = PHASE_CONFIG[phase];
              const count = phaseCounts[phase];
              const pct = (count / maxPhaseCount) * 100;
              const isActive = activePhase === phase;
              const rgb = hexToRgb(cfg.color);
              return (
                <div key={phase}
                  onClick={() => { setActivePhase(isActive ? null : phase); setSelectedTask(null); }}
                  style={{
                    display:"grid", gridTemplateColumns:"115px 1fr 32px",
                    gap:10, alignItems:"center",
                    cursor:"pointer",
                    opacity: activePhase && !isActive ? 0.38 : 1,
                    transition:"opacity 0.2s",
                  }}
                >
                  <span style={{
                    fontSize:11.5, fontWeight:700, textAlign:"right", lineHeight:1.2,
                    color: isActive ? cfg.color : "#94A3B8",
                  }}>{phase}</span>
                  <div style={{
                    height:20, borderRadius:4,
                    background:"rgba(255,255,255,0.04)", overflow:"hidden",
                  }}>
                    <div style={{
                      width:`${pct}%`, height:"100%", borderRadius:4,
                      background:`linear-gradient(90deg,rgba(${rgb},0.45),${cfg.color})`,
                      position:"relative",
                    }}>
                      {pct > 16 && (
                        <span style={{
                          position:"absolute", right:7, top:"50%",
                          transform:"translateY(-50%)",
                          fontSize:9, fontWeight:800, color:"rgba(255,255,255,0.75)",
                        }}>{cfg.icon}</span>
                      )}
                    </div>
                  </div>
                  <span style={{ fontSize:12, fontWeight:800, color:cfg.color, textAlign:"center" }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── LEGEND ── */}
        <div style={{
          display:"flex", gap:18, flexWrap:"wrap",
          justifyContent:"center", fontSize:11, color:"#475569",
          marginBottom:14,
        }}>
          {[
            { color:"#818CF8", label:"שלב נבחר" },
            { color:"#4ADE80", label:"תנאי מקדים (חייב לפני)" },
            { color:"#F87171", label:"ממתין (מחכה לסיום)" },
          ].map(l => (
            <span key={l.label} style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{
                width:10, height:10, borderRadius:2, display:"inline-block",
                background:`rgba(${hexToRgb(l.color)},0.25)`,
                border:`1.5px solid ${l.color}`,
              }}/>
              {l.label}
            </span>
          ))}
        </div>

        {/* ── FOOTER ── */}
        <div style={{
          textAlign:"center", fontSize:11, color:"#2D3748",
          paddingTop:14, borderTop:"1px solid rgba(255,255,255,0.04)",
        }}>
          {totalTasks} משימות · {PHASE_ORDER.length} שלבים · {totalDepsCount} תלויות
        </div>
      </div>
    </div>
  );
}

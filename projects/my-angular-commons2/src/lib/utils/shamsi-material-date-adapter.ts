import { DateAdapter } from "@angular/material/core";
import {CalendarDate, getDayOfWeek, PersianCalendar, fromDate, parseDate, DateFormatter, today, toCalendar} from '@internationalized/date';

export const PERSIAN_DATE_FORMATS = {
  parse: {
    dateInput: "jYYYY/jMM/jDD"
  },
  display: {
    dateInput: "jYYYY/jMM/jDD",
    monthYearLabel: "jYYYY jMMMM",
    dateA11yLabel: "jYYYY/jMM/jDD",
    monthYearA11yLabel: "jYYYY jMMMM"
  }
};

export class ShamsiMaterialDateAdapter extends DateAdapter<CalendarDate> {
    private persianCalendar = new PersianCalendar();
    private persianTimeZone = "Asia/Tehran";

    override getYear(date: CalendarDate): number {
        return date.year;
    }
    override getMonth(date: CalendarDate): number {
        return date.month - 1;
    }
    override getDate(date: CalendarDate): number {
        return date.day;
    }
    override getDayOfWeek(date: CalendarDate): number {
        return getDayOfWeek(date, "fa-IR");
    }
    override getMonthNames(style: "long" | "short" | "narrow"): string[] {
        return ["فروردین", "اردیبهشت", "خرداد",
            "تیر", "مرداد", "شهریور",
            "مهر", "آبان", "آذر",
            "دی", "بهمن", "اسفند"
        ];
    }
    override getDateNames(): string[] {
        const valuesArray = Array(31);
        for (let i = 0; i < 31; i++) {
        valuesArray[i] = String(i + 1);
        }
        return valuesArray;
    }
    override getDayOfWeekNames(style: "long" | "short" | "narrow"): string[] {
        if (style === "long") 
            return ["یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه","شنبه"];
        else
            return ["ی", "د", "س", "چ", "پ", "ج", "ش"];
    }
    override getYearName(date: CalendarDate): string {
        return date.year.toString();
    }
    override getFirstDayOfWeek(): number {
        return 6;
    }
    override getNumDaysInMonth(date: CalendarDate): number {
        return this.persianCalendar.getDaysInMonth(date);
    }
    override clone(date: CalendarDate): CalendarDate {
        return date.copy();
    }
    override createDate(year: number, month: number, date: number): CalendarDate {
        return new CalendarDate(this.persianCalendar, year, month + 1, date);
    }
    override today(): CalendarDate {
        let tmp = today(this.persianTimeZone);
        let result = toCalendar(tmp, this.persianCalendar);
        return result;
    }
    override parse(value: any, parseFormat: any): CalendarDate {   
        if (!value) return null as any;
        if (value instanceof CalendarDate) return value;

        if (typeof value === "string") {
            const parts = value.trim().split(/[\/\-]/);
            if (parts.length === 3) {
            const y = Number(parts[0]);
            const m = Number(parts[1]);
            const d = Number(parts[2]);
            if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
                return new CalendarDate(this.persianCalendar, y, m, d);
            }
            }
        }
        return null as any;
    }

    override format(date: CalendarDate, displayFormat: any): string {
        // return date.year + "/" + date.month + "/" + date.day; 
        if (!date || Number.isNaN(date.year) || Number.isNaN(date.month) || Number.isNaN(date.day)) {
            return "";
        }
        const y = date.year;
        const m = String(date.month).padStart(2, "0");
        const d = String(date.day).padStart(2, "0");
        return `${y}/${m}/${d}`;  // e.g. 1403/07/01
    }
    
    override addCalendarYears(date: CalendarDate, years: number): CalendarDate {
        return date.add({years: years});
    }
    override addCalendarMonths(date: CalendarDate, months: number): CalendarDate {
        return date.add({months: months});
    }
    override addCalendarDays(date: CalendarDate, days: number): CalendarDate {
        return date.add({days: days});
    }
    override toIso8601(date: CalendarDate): string {
        const iso = toCalendar(date, this.persianCalendar);
        return `${iso.year}-${String(iso.month).padStart(2, "0")}-${String(iso.day).padStart(2, "0")}`;
    }
    override isDateInstance(obj: any): boolean {
        if(obj instanceof CalendarDate) 
            return true;
        return false;
    }
    override isValid(date: CalendarDate): boolean {
        return date != null && !Number.isNaN(date.year) && !Number.isNaN(date.month) && !Number.isNaN(date.day);;
    }
    override invalid(): CalendarDate {
        return new CalendarDate(this.persianCalendar, NaN, NaN, NaN);;
    }

    

}
import { AbstractControl } from '@angular/forms';

export const Patterns = {
    // Email:`^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$`,
    Email: `[a-zA-Z0-9._%+-]{1,}@[a-zA-Z0-9.-]{2,}[.]{1}[a-zA-Z]{2,}$`,
    OnlyArabicLetters: `[\u0600-\u06FF\s]`,
    OnlyEnglishLetters: `^[A-Za-z\s]+$`,
    OnlyNumbers: `^[0-9]*$`,
    SaudiMobile: `^\\+9665\\d{8}|05\\d{8}|\\+1\\(\\d{3}\\)\\d{3}-\\d{4}|\\+1\\d{10}|\\d{3}-\\d{3}-\\d{4}$`,
    // PhoneMobile: `^\d([- ]*\d){6,13}$`,
    PhoneMobile: `^([0|\+[0-9]{1,5})?([0-9]{10})$`,
    DateMMDDYYYY: `^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$`,
    DateDDMMYYYY: `^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$`,
    Decimal: `^\d*\.\d{1,4}$`,
}
export function MinusValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value>=0) {
        return { 'TodayValidator': true };
    }
    return null;
}

export function TodayValidator(control: AbstractControl): { [key: string]: boolean } | null {
    var myDate = new Date();
    if (myDate.getTime()>Date.parse(control.value)) {
        return { 'TodayValidator': true };
    }
    return null;
}


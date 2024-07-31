import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMinutes',
  standalone: true,
})
export class FormatMinutesPipe implements PipeTransform {
  transform(minutes: number, ...args: unknown[]): unknown {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = '';
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (remainingMinutes > 0) {
      if (hours > 0) {
        result += ' ';
      }
      result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    return result;
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';
@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(value: Date): string {
    let today = moment();
    let birthdate = moment(value);
    let years = today.diff(birthdate, 'years');
    let html: string = years + ' years old';

    // html += today.subtract(years, 'years').diff(birthdate, 'months') + ' mo';

    return html;
  }
}

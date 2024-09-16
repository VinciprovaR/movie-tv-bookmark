import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'age',
  standalone: true,
})
export class AgePipe implements PipeTransform {
  transform(value: Date, ...params: any[]): string {
    let today;
    if(params.length > 0){
      today = moment(params[0]);
    }
    else{
      today = moment();
    }
    let birthdate = moment(value);
    let years = today.diff(birthdate, 'years');
    let html: string = years + ' years old';
    return html;
  }
}

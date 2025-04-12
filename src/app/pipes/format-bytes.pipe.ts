import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatBytes'
})
export class FormatBytesPipe implements PipeTransform {
  transform(sizeInGB: string): string {
    const gb = parseFloat(sizeInGB);
    if (gb < 1) return `${(gb * 1024).toFixed(1)} MB`;
    return `${gb.toFixed(1)} GB`;
  }
}
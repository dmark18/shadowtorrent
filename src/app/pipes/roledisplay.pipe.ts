import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roleDisplay'
})
export class RoleDisplayPipe implements PipeTransform {
  private roleMap: Record<string, string> = {
    admin: 'ADMIN',
    user: 'USER',
    banned: 'KITILTOTT',
  };

  transform(value: string): string {
    if (!value) return '[Ismeretlen szerep]';
    return this.roleMap[value.toLowerCase()] || value;
  }
}
 
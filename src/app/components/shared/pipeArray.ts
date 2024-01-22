import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortArray'
})
export class SortArrayPipe implements PipeTransform {
  transform(array: any[], field: string): any[] {
    if (!Array.isArray(array) || array.length <= 1) {
      return array;
    }

    // Utiliza el método de comparación para ordenar el array por el campo especificado
    return array.sort((a, b) => a[field].localeCompare(b[field]));
  }
}
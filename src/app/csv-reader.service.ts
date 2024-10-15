import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';
import { Observable } from 'rxjs';
import { Course } from './dashboard/dashboard.component';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  private csvFilePath = 'combined_courses.csv'; // Path to your CSV file

  constructor(private http: HttpClient) {}

  fetchCourses(): Observable<Course[]> {
    return new Observable<Course[]>((observer) => {
      this.http.get(this.csvFilePath, { responseType: 'text' }).subscribe({
        next: (data) => {
          const courses = this.parseCSV(data);
          observer.next(courses);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }

  private parseCSV(data: string): Course[] {
    const parsedData = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
    });

    const courses: Course[] = parsedData.data.map((row: any) => {
      const { Prüfungsfach, Modul, Titel, ...offerings } = row;

      // Create offerings object with boolean values
      const parsedOfferings = Object.fromEntries(
        Object.entries(offerings).map(([semester, value]) => [semester, value === '1'])
      );

      // Return the course object that matches the Course interface
      return {
        pruefungsfach: Prüfungsfach, // Ensure the property name matches the interface
        modul: Modul,                 // Ensure the property name matches the interface
        title: Titel,                 // Ensure the property name matches the interface
        semesters: parsedOfferings,   // Offerings now is an object with boolean values
      } as Course;                    // Type assertion to match Course type
    });

    return courses;
  }
}

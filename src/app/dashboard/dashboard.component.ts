import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CsvService } from '../csv-reader.service';

export interface Course {
  pruefungsfach: string;
  modul: string;
  title: string;
  semesters: { [key: string]: boolean }; // e.g., { '2024S': true, '2023W': false }
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTableModule,   // Import Material table for styling
    MatCardModule,    // Import Material card for layout
    MatIconModule 
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  displayedColumns = ['pruefungsfach', 'modul', 'title', '2024W', '2024S', '2023W', '2023S', '2022W', '2022S', '2021W', '2021S']
  courses: Course[] = [];
  semesters = [
    {id: 1, name: '2024W'},
    {id: 2, name: '2024S'}, 
    {id: 3, name: '2023W'}, 
    {id: 4, name: '2023S'},
    {id: 5, name: '2022W'},
    {id: 6, name: '2022S'},   
    {id: 7, name: '2021W'}, 
    {id: 8, name: '2021S'}, 
  ]

  constructor(private csvService: CsvService) {}

  ngOnInit(): void {
    this.csvService.fetchCourses().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
      }
    });
  }
}

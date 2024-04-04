import {Component, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {Observable} from "rxjs";
import {Category, User} from "../interfaces";
import {CategoryService} from "../services/category.service";
import {
  MatCardModule
} from "@angular/material/card";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NewsService} from "../services/news.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [
    MatCardModule,
    MatButton,
    AsyncPipe,
    NgIf,
    MatProgressSpinner,
    RouterLink,
    NgForOf,
    DatePipe,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router, private categoryService: CategoryService, private newsService: NewsService, private _snackBar: MatSnackBar) {
  }

  categories$: Observable<Category[]> = new Observable<Category[]>()
  activeCard: boolean = false

  form: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.maxLength(30), Validators.minLength(2), Validators.required])
  })

  onSubmit() {
    this.categoryService.createCategory(this.form.value).subscribe({
        next: (category: Category) => {
          this.router.navigate(['/categories', category.id])
          this._snackBar.open('Категорія була успішно збережена!', 'Добре!')
        },
        error: err => {
          this._snackBar.open('Сталася помилка, спробуйте ще раз!', 'Добре!')
        }
      }
    )
  }

  ngOnInit() {
    this.categories$ = this.categoryService.fetch();
    this.fetchNewsWithCategory();

  }

  fetchNewsWithCategory() {
    this.categories$.subscribe({
      next: categories => {
        categories.forEach(category => {
            this.newsService.fetch(category.id)
          }
        )
      },
      error: err => {
        throw new Error(err)
      }
    })
  }

  getFullImageUrl(filename: string | undefined): string {
    return `http://localhost:3000/news/${filename}`;
  }
}

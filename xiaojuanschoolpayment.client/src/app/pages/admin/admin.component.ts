import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SchoolService } from '../../../services/school.service';
import { SchoolDTO } from '../../../interfaces/school.dto';

@Component({
  selector: 'app-admin',
  standalone: false,
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  schoolForm: FormGroup;

  constructor(private fb: FormBuilder, private schoolService: SchoolService) {
    this.schoolForm = this.fb.group({
      school: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  async submit() {
    if (this.schoolForm.valid) {
      const schoolDTO = {
        name: this.schoolForm.value.school,
        createdDate: this.schoolForm.value.date,
      } as SchoolDTO;
      await this.schoolService.saveSchool(schoolDTO);
    }
  }
}

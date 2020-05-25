import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
  		searchType: [null],
      searchCriteria: [null,Validators.minLength(1)]},
      {validator: searchTypeValidator}
  	);
  }

  ngOnInit(): void {
  }
  onSubmit(){
    console.log(this.userForm);
    if(this.userForm.valid ){
      console.log("valid");
      return;
    }else{
      console.log("invalid");
    }
  }
}

const searchTypeValidator: ValidatorFn = (fg: FormGroup) => {
  const type = fg.get('searchType').value;
  const searchCondiion = fg.get('searchCriteria').value;
  if(type == "Keyword"){
    return {valid: true};
  }
  return null;
};

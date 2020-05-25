import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { GeolocationService } from '../geoloction.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss']
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  curCoords: any;

  constructor(private formBuilder: FormBuilder, private geolocation: GeolocationService) {
    this.userForm = this.formBuilder.group({
  		searchType: [null],
      searchCriteria: [null,Validators.minLength(1)]},
      {validator: searchTypeValidator}
    );
  }
  ngOnInit(): void {
    this.geolocation.getLocation().subscribe(res =>{
      console.log(res.coords);
      this.curCoords = res.coords;
    });
  }
  
  onSubmit(){
    if(this.userForm.valid ){
      console.log("valid");
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

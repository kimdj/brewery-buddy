import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { GeolocationService } from '@app/services/geoloction.service';
import { HttpService } from '@app/services/http.service';
import { NotificationService } from '@app/services/notification.service';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.scss'],
})
export class SearchFormComponent implements OnInit {
  userForm: FormGroup;
  curCoords: any;

  cols = [
    {
      name: 'id',
      header: 'ID',
    },
    {
      name: 'name',
      header: 'Name',
    },
    {
      name: 'abv',
      header: 'ABV',
    },
    {
      name: 'styleId',
      header: 'Style ID',
    },
    {
      name: 'status',
      header: 'Status',
    },
  ];
  displayedColumns: string[] = this.cols.map((e) => e.name);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  myData: any = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private geolocation: GeolocationService,
    private http: HttpService,
    private notifier: NotificationService
  ) {
    this.userForm = this.formBuilder.group(
      {
        searchType: [null],
        searchCriteria: [null, Validators.minLength(1)],
      },
      {
        validator: searchTypeValidator,
      }
    );

    // // Get brewery info
    // this.http.getBreweries().subscribe((data: any[]) => {
    //   this.dataSource = new MatTableDataSource(data);
    // });

    // Get beer info
    this.http.getBeers().subscribe((data: any) => {
      console.log('beers:');
      console.log(data);
      this.dataSource = new MatTableDataSource(data.data);
    });
  }

  ngOnInit(): void {
    this.geolocation.getLocation().subscribe((res) => {
      console.log(res.coords);
      this.curCoords = res.coords;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('valid');
    } else {
      console.log('invalid');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

const searchTypeValidator: ValidatorFn = (fg: FormGroup) => {
  const type = fg.get('searchType').value;
  const searchCondiion = fg.get('searchCriteria').value;
  if (type == 'Keyword') {
    return { valid: true };
  }
  return null;
};

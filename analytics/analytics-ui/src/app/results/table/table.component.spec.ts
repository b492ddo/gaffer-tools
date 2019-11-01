import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';

import { TableComponent } from './table.component';
import { ResultsService } from 'src/app/services/results.service';

const fullResultsData = [
  {
    class: 'test.Entity',
    group: 'BasicEntity1',
    vertex: 'vertex1',
    properties: {
      count: 1,
      prop1: 'value1'
    }
  },
  {
    class: 'test.Entity',
    group: 'BasicEntity1',
    vertex: 'vertex2',
    properties: {
      count: 2,
      prop1: 'value2'
    }
  },
  {
    class: 'test.Entity',
    group: 'BasicEntity2',
    vertex: 'vertex1',
    properties: {
      count: 1,
      prop2: 'value1'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge1',
    source: 'source1',
    destination: 'destination1',
    directed: true,
    properties: {
      count: 1,
      prop1: 'value1'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge1',
    source: 'source2',
    destination: 'destination2',
    directed: true,
    properties: {
      count: 2,
      prop1: 'value2'
    }
  },
  {
    class: 'test.Edge',
    group: 'BasicEdge2',
    source: 'source1',
    destination: 'destination1',
    directed: true,
    properties: {
      count: 1,
      prop2: 'value1'
    }
  },
  {
    class: 'String',
    value: 'value1'
  },
  {
    class: 'Integer',
    value: 4
  },
  {
    class: 'EntitySeed',
    vertex: 'vertex1'
  }
];

class ResultsServiceStub {
  get = () => {
    return fullResultsData;
  }
}

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [
        BrowserAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSortModule,
        MatTableModule],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the page to 0 by default', () => {
    expect(component.paginator.pageIndex).toEqual(0);
  });

  it('should contain the data sent', () => {
    expect(component.data.results.data).toEqual(fullResultsData);
  });

  describe('removeColumn()', () => {
    it('should hide an existing column', () => {
      component.columnsToDisplay = ['1', '2', '3'];
      component.selected = '2';
      component.removeColumn();
      fixture.detectChanges();
      expect(component.columnsToDisplay).toEqual(['1', '3']);
    });
    it('should do nothing if column is already hidden', () => {
      component.columnsToDisplay = ['1', '3'];
      component.selected = '2';
      component.removeColumn();
      fixture.detectChanges();
      expect(component.columnsToDisplay).toEqual(['1', '3']);
    });
  });
});

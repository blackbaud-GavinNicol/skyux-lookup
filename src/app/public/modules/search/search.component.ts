import {
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Output,
  Input,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from '@angular/core';

import {
  SkySearchAdapterService
} from './search-adapter.service';

import {
  SkyMediaBreakpoints,
  SkyMediaQueryService
} from '@skyux/core';

import { Subscription } from 'rxjs/Subscription';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {
  style,
  state,
  trigger,
  transition,
  animate,
  AnimationEvent
} from '@angular/animations';

const INPUT_SHOWN_STATE: string = 'inputShown';
const INPUT_HIDDEN_STATE: string = 'inputHidden';
const EXPAND_MODE_RESPONSIVE: string = 'responsive';
const EXPAND_MODE_FIT: string = 'fit';
const EXPAND_MODE_NONE: string = 'none';

@Component({
  selector: 'sky-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [
    trigger('inputState', [
      state(INPUT_HIDDEN_STATE,
        style({
          opacity: 0,
          width: 0
      })),
      state(INPUT_SHOWN_STATE,
        style({
          opacity: 1,
          width: '100%'
      })),
      transition('* <=> *', animate('150ms'))
    ])
  ],
  providers: [
    SkySearchAdapterService
  ]
})
export class SkySearchComponent implements OnDestroy, OnInit, OnChanges {

  @Output()
  public searchApply = new EventEmitter<string>();

  @Output()
  public searchChange = new EventEmitter<string>();

  @Output()
  public searchClear = new EventEmitter<void>();

  @Input()
  public searchText: string;

  @Input()
  public expandMode: string = EXPAND_MODE_RESPONSIVE;

  @Input()
  public debounceTime: number = 0;

  @Input()
  public disabled: boolean = false;

  public isFullWidth: boolean = false;

  public isCollapsible: boolean = true;

  @Input()
  public placeholderText: string;

  public inputAnimate: string = INPUT_SHOWN_STATE;
  public breakpointSubscription: Subscription;
  public searchButtonShown: boolean = false;
  public mobileSearchShown: boolean = false;
  public dismissButtonShown: boolean = false;
  public clearButtonShown: boolean = false;
  public searchInputFocused: boolean = false;

  private searchUpdated: Subject<string> = new Subject<string>();

  constructor(
    private mediaQueryService: SkyMediaQueryService,
    private elRef: ElementRef,
    private searchAdapter: SkySearchAdapterService,
    private changeRef: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    if (this.searchShouldCollapse()) {
      this.breakpointSubscription = this.mediaQueryService.subscribe(
        (args: SkyMediaBreakpoints) => {
          this.mediaQueryCallback(args);
          this.changeRef.detectChanges();
        }
      );
    }

    this.searchUpdated.asObservable()
      .debounceTime(this.debounceTime)
      .distinctUntilChanged().subscribe(value => {
        this.searchChange.emit(value);
      });
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.expandModeBindingChanged(changes)) {
      switch (this.expandMode) {
        case EXPAND_MODE_NONE:
          this.isCollapsible = false;
          this.isFullWidth = false;
          break;
        case EXPAND_MODE_FIT:
          this.isCollapsible = false;
          this.isFullWidth = true;
          break;
        default:
          this.isCollapsible = true;
          this.isFullWidth = false;
          break;
      }

    }

    if (this.searchBindingChanged(changes)) {
      this.clearButtonShown = this.searchText && this.searchText !== '';
      if (this.shouldOpenInput()) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      }
    }
    this.changeRef.detectChanges();
  }

  public inputFocused(isFocused: boolean) {
    this.searchInputFocused = isFocused;
  }

  public clearSearchText() {
    this.searchText = '';
    this.clearButtonShown = false;

    this.searchAdapter.focusInput(this.elRef);
    this.searchChange.emit(this.searchText);

    this.searchApply.emit(this.searchText);

    this.searchClear.emit();
  }

  public enterPress(event: KeyboardEvent, searchText: string) {
    if (event.which === 13) {
      this.applySearchText(searchText);
    }
  }

  public applySearchText(searchText: string) {
    // Double check that search text is defined before attempting to trim off whitespace
    if (searchText) {
      searchText = searchText.trim();
    }

    if (searchText !== this.searchText) {
      this.searchText = searchText;
    }
    this.clearButtonShown = searchText && searchText !== '';
    if (searchText && searchText !== '') {
      this.searchAdapter.selectInput(this.elRef);
    }

    this.searchApply.emit(searchText);
  }

  public searchTextChanged(searchText: string) {
    this.searchText = searchText;
    this.searchUpdated.next(searchText);
  }

  public toggleSearchInput(showInput: boolean) {
    if (this.searchShouldCollapse()) {
      if (showInput) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      } else {
        this.inputAnimate = INPUT_HIDDEN_STATE;
      }
    }
  }

  public inputAnimationStart(event: AnimationEvent) {
    if (this.searchShouldCollapse()) {
      this.searchAdapter.startInputAnimation(this.elRef);

      if (event.toState === INPUT_SHOWN_STATE
        && this.mediaQueryService.current === SkyMediaBreakpoints.xs) {
        this.mobileSearchShown = true;
        this.searchButtonShown = false;

      }

    }
  }

  public inputAnimationEnd(event: AnimationEvent) {
    if (this.searchShouldCollapse()) {
      this.searchAdapter.endInputAnimation(this.elRef);

      this.searchButtonShown = event.toState === INPUT_HIDDEN_STATE
        && this.mediaQueryService.current === SkyMediaBreakpoints.xs;

      if ((event.toState === INPUT_HIDDEN_STATE
        && this.mediaQueryService.current === SkyMediaBreakpoints.xs)
        || this.mediaQueryService.current !== SkyMediaBreakpoints.xs) {
        this.mobileSearchShown = false;
      }
    }
  }

  public ngOnDestroy() {
    if (this.breakpointSubscription) {
      this.breakpointSubscription.unsubscribe();
    }

    this.searchUpdated.complete();
  }
  private searchBindingChanged(changes: SimpleChanges) {
    return changes['searchText'] &&
      changes['searchText'].previousValue !== changes['searchText'].currentValue;
  }

  private expandModeBindingChanged(changes: SimpleChanges) {
    return changes['expandMode'] &&
      changes['expandMode'].previousValue !== changes['expandMode'].currentValue;
  }

  private shouldOpenInput() {
    return this.searchText !== '' &&
      this.mediaQueryService.current === SkyMediaBreakpoints.xs && this.searchShouldCollapse();
  }

  private mediaQueryCallback(args: SkyMediaBreakpoints) {
    if (this.searchShouldCollapse()) {
      if (args === SkyMediaBreakpoints.xs) {
        this.inputAnimate = INPUT_HIDDEN_STATE;
      } else if (this.inputAnimate !== INPUT_SHOWN_STATE) {
        this.inputAnimate = INPUT_SHOWN_STATE;
      } else {
        this.mobileSearchShown = false;
      }
    }
    this.changeRef.markForCheck();
  }

  private searchShouldCollapse() {
    return (this.isCollapsible || this.isCollapsible === undefined) && this.isFullWidth !== true;
  }
}

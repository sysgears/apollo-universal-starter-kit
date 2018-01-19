import { OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle, default as AbstractButton, TypedValue } from '../../common/components/Button';

const buttonSizes: TypedValue[] = [
  {
    type: ButtonSize.XS,
    value: 'btn btn-xs'
  },
  {
    type: ButtonSize.Small,
    value: 'btn btn-sm'
  },
  {
    type: ButtonSize.Default,
    value: 'btn btn-md'
  },
  {
    type: ButtonSize.Large,
    value: 'btn btn-lg'
  }
];

const buttonStyles: TypedValue[] = [
  {
    type: ButtonStyle.Empty,
    value: ''
  },
  {
    type: ButtonStyle.Default,
    value: 'btn btn-default'
  },
  {
    type: ButtonStyle.Primary,
    value: 'btn btn-primary'
  },
  {
    type: ButtonStyle.Success,
    value: 'btn btn-success'
  },
  {
    type: ButtonStyle.Info,
    value: 'btn btn-info'
  },
  {
    type: ButtonStyle.Warning,
    value: 'btn btn-warning'
  },
  {
    type: ButtonStyle.Danger,
    value: 'btn btn-danger'
  },
  {
    type: ButtonStyle.Link,
    value: 'btn btn-link'
  },
  {
    type: ButtonStyle.Dashed,
    value: 'btn btn-primary'
  },
  {
    type: ButtonStyle.Close,
    value: 'close'
  }
];

export default class Button extends AbstractButton implements OnInit {
  public ngOnInit(): void {
    this.setClassNames('', buttonStyles, buttonSizes);
  }
}

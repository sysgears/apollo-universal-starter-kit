import { OnInit } from '@angular/core';
import { ButtonSize, ButtonStyle, default as AbstractButton, TypedValue } from '../../common/components/Button';

const buttonSizes: TypedValue[] = [
  {
    type: ButtonSize.XS,
    value: 'ant-btn-sm'
  },
  {
    type: ButtonSize.Small,
    value: 'ant-btn-sm'
  },
  {
    type: ButtonSize.Default,
    value: ''
  },
  {
    type: ButtonSize.Large,
    value: 'ant-btn-lg'
  }
];

const buttonStyles: TypedValue[] = [
  {
    type: ButtonStyle.Empty,
    value: ''
  },
  {
    type: ButtonStyle.Default,
    value: ''
  },
  {
    type: ButtonStyle.Primary,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Success,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Info,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Warning,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Danger,
    value: 'ant-btn-danger'
  },
  {
    type: ButtonStyle.Link,
    value: 'ant-btn-primary'
  },
  {
    type: ButtonStyle.Dashed,
    value: 'ant-btn-dashed'
  },
  {
    type: ButtonStyle.Close,
    value: 'ant-btn-primary'
  }
];

export default class Button extends AbstractButton implements OnInit {
  public ngOnInit(): void {
    this.setClassNames('ant-btn ', buttonStyles, buttonSizes);
  }
}

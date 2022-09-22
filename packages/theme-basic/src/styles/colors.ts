import * as radixColors from '@radix-ui/colors';

export type Colors = keyof typeof lightColors;

export const base = {
  inherit: 'inherit',
  current: 'currentColor',
  transparent: 'transparent',
  brand: '#58c09b',

  ...radixColors.blackA,
  ...radixColors.whiteA,
};

export const lightColors = {
  ...base,
  ...radixColors.tomato,
  ...radixColors.red,
  ...radixColors.crimson,
  ...radixColors.pink,
  ...radixColors.plum,
  ...radixColors.purple,
  ...radixColors.violet,
  ...radixColors.indigo,
  ...radixColors.blue,
  ...radixColors.cyan,
  ...radixColors.teal,
  ...radixColors.green,
  ...radixColors.grass,
  ...radixColors.orange,
  ...radixColors.brown,
  ...radixColors.sky,
  ...radixColors.mint,
  ...radixColors.lime,
  ...radixColors.yellow,
  ...radixColors.amber,
  ...radixColors.gold,
  ...radixColors.bronze,

  gray1: radixColors.slate.slate1,
  gray2: radixColors.slate.slate2,
  gray3: radixColors.slate.slate3,
  gray4: radixColors.slate.slate4,
  gray5: radixColors.slate.slate5,
  gray6: radixColors.slate.slate6,
  gray7: radixColors.slate.slate7,
  gray8: radixColors.slate.slate8,
  gray9: radixColors.slate.slate9,
  gray10: radixColors.slate.slate10,
  gray11: radixColors.slate.slate11,
  gray12: radixColors.slate.slate12,

  accent1: radixColors.mint.mint1,
  accent2: radixColors.mint.mint2,
  accent3: radixColors.mint.mint3,
  accent4: radixColors.mint.mint4,
  accent5: radixColors.mint.mint5,
  accent6: radixColors.mint.mint6,
  accent7: radixColors.mint.mint7,
  accent8: radixColors.mint.mint8,
  accent9: radixColors.mint.mint9,
  accent10: radixColors.mint.mint10,
  accent11: radixColors.mint.mint11,
  accent12: radixColors.mint.mint12,

  bodyColor: '#F5F6F7',
  textColor: '$gray11',
  borderColor: '$gray5',
  borderHover: '$gray7',

  inputBg: '$gray1',
  inputColor: '$gray11',
  inputBorder: '$gray6',
  inputPlaceholderColor: '$gray9',
};

export const darkColors = {
  ...base,
  ...radixColors.tomatoDark,
  ...radixColors.redDark,
  ...radixColors.crimsonDark,
  ...radixColors.pinkDark,
  ...radixColors.plumDark,
  ...radixColors.purpleDark,
  ...radixColors.violetDark,
  ...radixColors.indigoDark,
  ...radixColors.blueDark,
  ...radixColors.cyanDark,
  ...radixColors.tealDark,
  ...radixColors.greenDark,
  ...radixColors.grassDark,
  ...radixColors.orangeDark,
  ...radixColors.brownDark,
  ...radixColors.skyDark,
  ...radixColors.mintDark,
  ...radixColors.limeDark,
  ...radixColors.yellowDark,
  ...radixColors.amberDark,
  ...radixColors.goldDark,
  ...radixColors.bronzeDark,

  gray1: radixColors.slateDark.slate1,
  gray2: radixColors.slateDark.slate2,
  gray3: radixColors.slateDark.slate3,
  gray4: radixColors.slateDark.slate4,
  gray5: radixColors.slateDark.slate5,
  gray6: radixColors.slateDark.slate6,
  gray7: radixColors.slateDark.slate7,
  gray8: radixColors.slateDark.slate8,
  gray9: radixColors.slateDark.slate9,
  gray10: radixColors.slateDark.slate10,
  gray11: radixColors.slateDark.slate11,
  gray12: radixColors.slateDark.slate12,

  accent1: radixColors.mintDark.mint1,
  accent2: radixColors.mintDark.mint2,
  accent3: radixColors.mintDark.mint3,
  accent4: radixColors.mintDark.mint4,
  accent5: radixColors.mintDark.mint5,
  accent6: radixColors.mintDark.mint6,
  accent7: radixColors.mintDark.mint7,
  accent8: radixColors.mintDark.mint8,
  accent9: radixColors.mintDark.mint9,
  accent10: radixColors.mintDark.mint10,
  accent11: radixColors.mintDark.mint11,
  accent12: radixColors.mintDark.mint12,

  bodyColor: '#101112',
  textColor: '$gray11',
  borderColor: '$bodyColor',
  borderHover: '$gray5',

  inputBg: '$gray2',
  inputColor: '$gray12',
  inputBorder: 'transparent',
  inputPlaceholderColor: '$gray9',
};

export type ColorKeys =
  | 'gray'
  | 'accent'
  | 'tomato'
  | 'red'
  | 'crimson'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'grass'
  | 'orange'
  | 'brown'
  | 'sky'
  | 'mint'
  | 'lime'
  | 'yellow'
  | 'amber'
  | 'gold'
  | 'bronze';

export const colorKeys: ColorKeys[] = [
  'gray',
  'accent',
  'tomato',
  'red',
  'crimson',
  'pink',
  'plum',
  'purple',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'grass',
  'orange',
  'brown',
  'sky',
  'mint',
  'lime',
  'yellow',
  'amber',
  'gold',
  'bronze',
];

export const allColors = Object.keys(lightColors);

export function isBright(color: string) {
  return Boolean(color.match(/gray|accent|mint|sky|lime|yellow|amber/));
}

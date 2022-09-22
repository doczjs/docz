export type TextSizes =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'
  | '7xl';

const TEXT_SIZE_MAP = {
  xs: ['0.75rem', '1rem'] /** 12px | 16px */,
  sm: ['0.875rem', '1.25rem'] /** 14px | 20px */,
  base: ['1rem', '1.5rem'] /** 16px | 24px */,
  lg: ['1.125rem', '1.75rem'] /** 18px | 28px */,
  xl: ['1.25rem', '1.75rem'] /** 20px | 28px */,
  '2xl': ['1.5rem', '2rem'] /** 24px | 32px */,
  '3xl': ['1.875rem', '2.25rem'] /** 30px | 36px */,
  '4xl': ['2.25rem', '2.5rem'] /** 36px | 40px */,
  '5xl': ['3rem', '1'] /** 48px */,
  '6xl': ['3.75rem', '1'] /** 60px */,
  '7xl': ['4.5rem', '1'] /** 72px */,
  '8xl': ['6rem', '1'] /** 96px */,
  '9xl': ['8rem', '1'] /** 128px */,
};

export const textSize = (value: TextSizes) => ({
  fontSize: TEXT_SIZE_MAP[value][0],
  lineHeight: TEXT_SIZE_MAP[value][1],
});

textSize.__keys = Object.keys(TEXT_SIZE_MAP) as TextSizes[];

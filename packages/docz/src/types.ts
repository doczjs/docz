export type Menu = {
  name: string;
  route?: string;
  href?: string;
  menu?: Menu[];
};

export type Entry = {
  link: string | null;
  filepath: string;
  fullpath: string;
  id: string;
  hidden: boolean;
  menu: string | null;
  name: string;
  route: string;
  slug: string;
  frontmatter?: Record<string, any>;
};

export type ThemeConfig = Record<string, any>;
export type Config = {
  title: string;
  description: string;
  menu: Menu[];
  version: string | null;
  repository: string | null;
  themeConfig: ThemeConfig;
};

export type PropItem = {
  key: string;
  // TODO: type here later
  value: {
    filePath: string;
    description: string;
    displayName: string;
    methods: any[];
    props: any[];
  }[];
};

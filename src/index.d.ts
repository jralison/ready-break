
export type TamanhoNotaAdesiva = {
  largura: number;
  altura: number;
}

export type TamanhoPapel = {
  largura: number;
  altura: number;
}

export type Margem = {
  horizontal: number;
  vertical: number;
}

export type ItemMenu = {
  uid: string;
  rotulo: string;
  icone?: string;
  descricao?: string;
  desabilitado?: boolean;
  itens?: ItemMenu[];
  seletor?: (value: never) => void;
}

export type ItemMenuTamanhoNotaAdesiva = ItemMenu & TamanhoNotaAdesiva
export type ItemMenuTamanhoPapel = ItemMenu & TamanhoPapel
export type ItemMenuMargem = ItemMenu & Margem

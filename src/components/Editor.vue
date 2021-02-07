<template>
  <v-container class="fill-height pa-0" fluid>
    <v-row class="fill-height" no-gutters>
      <v-col cols="4">
        <v-navigation-drawer permanent width="100%">
          <v-row class="fill-height" no-gutters>
            <v-col>
              <v-navigation-drawer permanent>
                <v-list subheader dense shaped>
                  <v-list-item-group
                    v-for="item in opcoesConfiguracao"
                    :key="item.uid"
                    color="accent"
                    class="mb-4"
                    mandatory
                    @change="item.seletor"
                  >
                    <v-subheader>
                      {{ item.rotulo }}
                    </v-subheader>
                    <v-list-item
                      v-for="itemFilho in item.itens"
                      :key="itemFilho.uid"
                      :value="itemFilho"
                      :disabled="itemFilho.desabilitado || item.desabilitado"
                    >
                      <v-list-item-action v-if="itemFilho.icone">
                        <v-icon>{{ itemFilho.icone }}</v-icon>
                      </v-list-item-action>
                      <v-list-item-content>
                        <v-list-item-title>
                          {{ itemFilho.rotulo }}
                        </v-list-item-title>
                        <v-list-item-subtitle v-if="itemFilho.descricao">
                          {{ itemFilho.descricao }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
              </v-navigation-drawer>
            </v-col>

            <v-col>
              <v-list dense subheader>
                <v-subheader>
                  Informações calculadas
                </v-subheader>
                <v-list-item
                  v-for="informacao in informacoesCalculadas"
                  :key="informacao.uid"
                >
                  <v-list-item-content>
                    <v-list-item-title>
                      {{ informacao.rotulo }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ informacao.descricao }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-navigation-drawer>
      </v-col>
      <v-col cols="8">
        <v-responsive class="fill-height">
          <v-overlay
            v-if="processandoDocumento"
            absolute
            opacity=".75"
            dark
          >
            <v-progress-circular
              color="white"
              indeterminate
            />
          </v-overlay>
          <embed
            width="100%"
            height="100%"
            :src="dataUriPdf"
            type="application/pdf"
          />
        </v-responsive>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import {
  ItemMenu,
  ItemMenuMargem,
  ItemMenuTamanhoNotaAdesiva,
  ItemMenuTamanhoPapel,
  Margem,
  TamanhoNotaAdesiva,
  TamanhoPapel,
} from '@/index'
import { jsPDF } from 'jspdf'
import { Component, Vue } from 'vue-property-decorator'

const tamanhosNotasAdesivas: ItemMenuTamanhoNotaAdesiva[] = [
  { uid: '56x56', rotulo: '56 x 56 (mm)', largura: 56, altura: 56 },
  { uid: '76x76', rotulo: '76 x 76 (mm)', largura: 76, altura: 76 },
  { uid: '50x50', rotulo: '50 x 50 (mm)', largura: 50, altura: 50 },
  { uid: '50x38', rotulo: '50 x 38 (mm)', largura: 50, altura: 38 },
]

const tamanhosPapel: ItemMenuTamanhoPapel[] = [
  { uid: 'a4retrato', rotulo: 'A4 (retrato)', largura: 210, altura: 297 },
  { uid: 'a4paisagem', rotulo: 'A4 (paisagem)', largura: 297, altura: 210 },
]

const margens: ItemMenuMargem[] = [
  { uid: 'estreita', rotulo: 'Estreita', horizontal: 12.7, vertical: 12.7 },
  { uid: 'larga', rotulo: 'Larga', horizontal: 25, vertical: 25 },
]

@Component
export default class Editor extends Vue {
  private tamanhoNotaAdesiva: TamanhoNotaAdesiva = tamanhosNotasAdesivas[0]
  private tamanhoPapel: TamanhoPapel = tamanhosPapel[0]
  private margem: Margem = margens[0]
  private espacamentoMinimo = 3

  processandoDocumento = false
  margens: ItemMenuMargem[] = margens

  get areaImpressao(): { largura: number; altura: number; x: number; y: number } {
    const { largura: larguraPagina, altura: alturaPagina } = this.tamanhoPapel
    const { horizontal: margemHorizontal, vertical: margemVertical } = this.margem
    return {
      largura: (larguraPagina - (margemHorizontal * 2)),
      altura: (alturaPagina - (margemVertical * 2)),
      x: margemHorizontal,
      y: margemVertical,
    }
  }

  get espacamentoEntreNotas(): { x: number; y: number } {
    const precisao = 1
    const [larguraExternaNota, alturaExternaNota] = [
      (this.notasPorLinha * (this.tamanhoNotaAdesiva.largura)),
      (this.notasPorColuna * (this.tamanhoNotaAdesiva.altura)),
    ]
    const [areaLivreHorizontal, areaLivreVertical] = [
      (this.areaImpressao.largura - larguraExternaNota) / this.notasPorLinha,
      (this.areaImpressao.altura - alturaExternaNota) / this.notasPorColuna,
    ]
    return {
      x: Math.max(this.espacamentoMinimo, Math.round((precisao * areaLivreHorizontal)) / precisao),
      y: Math.max(this.espacamentoMinimo, Math.round((precisao * areaLivreVertical)) / precisao),
    }
  }

  get informacoesCalculadas(): ItemMenu[] {
    return [
      {
        uid: 'notasPorPagina',
        rotulo: 'Notas por página',
        descricao: `${this.notasPorPagina} nota${this.notasPorPagina > 1 ? 's' : ''} (${this.notasPorLinha} x ${this.notasPorColuna})`,
      },
      {
        uid: 'entreNotas',
        rotulo: 'Espaçamento entre notas',
        descricao: `${this.espacamentoEntreNotas.x}mm x ${this.espacamentoEntreNotas.y}mm`
      },
      {
        uid: 'margemFinal',
        rotulo: 'Margem real',
        descricao: `${this.origemFinal.x}mm x ${this.origemFinal.y}mm`
      },
    ]
  }

  get notasPorLinha(): number {
    const { largura: larguraNota } = this.tamanhoNotaAdesiva
    return Math.floor(this.areaImpressao.largura / (larguraNota + this.espacamentoMinimo))
  }

  get notasPorColuna(): number {
    const { altura: alturaNota } = this.tamanhoNotaAdesiva
    return Math.floor(this.areaImpressao.altura / (alturaNota + this.espacamentoMinimo))
  }

  get notasPorPagina(): number {
    return (this.notasPorLinha * this.notasPorColuna)
  }

  get opcoesConfiguracao(): ItemMenu[] {
    return [
      {
        uid: 'tamanho',
        rotulo: 'Tamanho da nota adesiva',
        itens: this.opcoesOrdenadasTamanhoNota.map(tam => ({
          ...tam,
          icone: (tam.largura === tam.altura) ? 'mdi-square' : 'mdi-rectangle',
        })),
        seletor: (value: TamanhoNotaAdesiva) => {
          this.tamanhoNotaAdesiva = value
        },
      },
      {
        uid: 'pagina',
        rotulo: 'Tamanho do papel',
        itens: this.opcoesOrdenadasTamanhoPapel.map(papel => ({
          ...papel,
          descricao: `${papel.largura}mm x ${papel.altura}mm`,
        })),
        seletor: (tamanhoPapel: TamanhoPapel) => {
          this.tamanhoPapel = tamanhoPapel
        },
      },
      {
        uid: 'margem',
        rotulo: 'Margem mínima',
        itens: this.margens.map(margem => ({
          ...margem,
          descricao: `${margem.horizontal}mm x ${margem.vertical}mm`,
        })),
        seletor: (margem: Margem) => {
          this.margem = margem
        },
      },
    ]
  }

  // os tamanhos são ordenadas pela área do menor para o maior
  get opcoesOrdenadasTamanhoNota(): ItemMenuTamanhoNotaAdesiva[] {
    return Editor.ordenarPorArea(tamanhosNotasAdesivas)
  }

  // as páginas são ordenadas pela área da maior para a menor
  get opcoesOrdenadasTamanhoPapel(): ItemMenuTamanhoPapel[] {
    return Editor.ordenarPorArea(tamanhosPapel, true)
  }

  get documentoPdf(): jsPDF|null {
    try {
      window.console.info('Criando novo documento...')
      this.processandoDocumento = true
      const { largura, altura } = this.tamanhoPapel
      const doc = new jsPDF({
        orientation: (altura >= largura) ? 'portrait' : 'landscape',
        unit: 'mm',
        compress: true,
        format: [largura, altura]
      })
      doc.setDocumentProperties({
        title: `Notas adesivas ${this.tamanhoNotaAdesiva.largura}mm x ${this.tamanhoNotaAdesiva.altura}mm`,
      })
      doc.setDisplayMode('fullpage', 'single')
      this.desenharGuias(doc)
      return doc
    } catch (e) {
      window.console.error('Erro ao criar documento.', e)
      return null
    } finally {
      this.processandoDocumento = false
    }
  }

  get dataUriPdf(): URL|string {
    try {
      if (this.documentoPdf !== null) {
        window.console.info('Renderizando documento...')
        return this.documentoPdf.output('bloburi')
      } else {
        window.console.info('Sem documento para renderizar.', this.documentoPdf)
        return 'about:blank'
      }
    } catch (e) {
      window.console.error('Erro ao renderizar.', e)
      return 'about:blank'
    }
  }

  get origemFinal(): { x: number; y: number } {
    return {
      x: this.areaImpressao.x + (this.espacamentoEntreNotas.x / 2),
      y: this.areaImpressao.y + (this.espacamentoEntreNotas.y / 2),
    }
  }

  private desenharGuias(doc: jsPDF): void {
    const precisao = 1e1

    const regua = { cor: `${this.$vuetify.theme.currentTheme.accent}`, padrao: [1.25, .5] }
    const retangulo = { cor: `${this.$vuetify.theme.currentTheme.info}`, padrao: [] }

    const avancoHorizontal = (this.tamanhoNotaAdesiva.largura + this.espacamentoEntreNotas.x)
    const avancoVertical = (this.tamanhoNotaAdesiva.altura + this.espacamentoEntreNotas.y)

    doc.setTextColor(regua.cor)
    doc.setLineWidth(0.3)

    for (let linha = 0; linha < this.notasPorColuna; linha++) {
      for (let coluna = 0; coluna < this.notasPorLinha; coluna++) {
        const x = (this.origemFinal.x + (avancoHorizontal * coluna))
        const y = (this.origemFinal.y + (avancoVertical * linha))

        doc.setDrawColor(retangulo.cor)
        doc.setLineDashPattern(retangulo.padrao, 0)
        doc.rect(x, y, this.tamanhoNotaAdesiva.largura, this.tamanhoNotaAdesiva.altura)

        doc.setFontSize(9)
        doc.text(
          `${this.tamanhoNotaAdesiva.largura}mm x ${this.tamanhoNotaAdesiva.altura}mm`,
          (x + (this.tamanhoNotaAdesiva.largura / 2)),
          (y + (this.tamanhoNotaAdesiva.altura / 2)),
          { align: 'center', baseline: 'middle' }
        )

        if (linha === 0 && (coluna > 0 && coluna < this.notasPorLinha)) {
          const reguaX = (x - this.espacamentoEntreNotas.x)
          const distancia = Math.round((precisao * (x - reguaX)) / precisao)
          doc.setDrawColor(regua.cor)
          doc.setLineDashPattern(regua.padrao, 0)
          doc.line(reguaX, y, x, y)
          doc.setFontSize(8)
          doc.text(`${distancia} mm`, (reguaX + (distancia / 2)), (y - 1), { align: 'center' })
        }

        if (coluna === 0 && (linha > 0 && linha < this.notasPorColuna)) {
          const reguaY = (y - this.espacamentoEntreNotas.y)
          const distancia = Math.round((precisao * (y - reguaY)) / precisao)
          doc.setDrawColor(regua.cor)
          doc.setLineDashPattern(regua.padrao, 0)
          doc.line(x, y, x, (y - this.espacamentoEntreNotas.y))
          doc.setFontSize(8)
          doc.text(`${distancia} mm`, x, (y - this.espacamentoEntreNotas.y), { align: 'center', angle: -90 })
        }
      }
    }

    // réguas
    const distanciaX = this.origemFinal.x
    const distanciaY = this.origemFinal.y
    doc.setFontSize(8)
    doc.setDrawColor(regua.cor)
    doc.setLineDashPattern(regua.padrao, 0)
    doc.line(0, this.origemFinal.y, this.origemFinal.x, this.origemFinal.y)
    doc.text(`${distanciaX} mm`, (distanciaX / 2), (this.origemFinal.y - 1), { align: 'center' })
    doc.line(this.origemFinal.x, 0, this.origemFinal.x, this.origemFinal.y)
    doc.text(`${distanciaY} mm`, (this.origemFinal.x + 2), (distanciaY / 4), { align: 'center', angle: -90 })
  }

  private static ordenarPorArea<T extends { altura: number; largura: number }>(colecao: T[], reverso = false): T[] {
    return colecao.sort((a, b): number => {
      const areaA = (a.largura * a.altura)
      const areaB = (b.largura * b.altura)
      return ((areaA > areaB) ? 1 : ((areaA < areaB) ? -1 : 0)) * (reverso ? -1 : 1)
    })
  }
}
</script>

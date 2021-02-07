<template>
  <q-page class="flex flex-center" style="flex-direction: column; margim">

   <q-uploader
    multiple
    :factory="previewFile"
   />

   <section >
      <xlsx-workbook>
        <xlsx-sheet
          v-for="sheet in sheets"
          :collection="sheet.data"
          :key="sheet.name"
          :sheet-name="sheet.name"
        />
        <xlsx-download filename='arquivoBregalta.xlsx'>
          <q-btn class="flat" style="margin-top: 20px;" color="primary">Download</q-btn>
        </xlsx-download>
      </xlsx-workbook>
   </section>

  </q-page>
</template>

<style>
  .uploader {
    color: red;
  }
  .diplay-none {
    display:none;
  }
</style>

<script>
import parser from 'fast-xml-parser';
import { XlsxWorkbook, XlsxSheet, XlsxDownload } from "vue-xlsx";
import rowInfo from './rowInfo';
export default {
  name: 'HelloWorld',
  components: {
    XlsxWorkbook,
    XlsxSheet,
    XlsxDownload
  },
  mounted() {
    this.sheets = [{ name: "Página 1", data: []}]
  },

  data() {
    return {
      dataXlsx: [],
      sheets:[],
    }
  },

  methods: {
    previewFile(file) {
      var reader  = new FileReader();
      reader.onloadend = () => {
        var jsonRow = this.xml2Json(reader.result);
        this.sheets[0].data.push(this.createRowXlsx(jsonRow));
      }
      reader.readAsBinaryString(file[0]);
    },

    createRowXlsx(jsonRow) {
      console.log(jsonRow);
      var json = jsonRow.ListaDeclaracoes.declaracaoImportacao;
      json.cargaPaisProcedenciaNome
      var objRowReturn = {};
      rowInfo.forEach((x)=> {
        
          switch(x.key) {
            case 'conhecimentoCargaEmbarqueData':
              var stgDate = json[x.key].toString();
              objRowReturn[x.name] = `${stgDate.substr(6, 2)}/${stgDate.substr(4, 2)}/${stgDate.substr(0, 4)}`;
              break;  
            case 'condicaoVendaValorMoeda':
              var fob = json.adicao[x.key] ? json.adicao[x.key] : json.adicao[1][x.key] + json.adicao[0][x.key];
              json['fobDot'] = this.addDotMoeda(fob); 
              objRowReturn[x.name] = this.convertMoeda(fob, this.getMoeda(json.adicao['condicaoVendaMoedaNome']));
              break;
            case 'freteValorMoedaNegociada':
              var frete = json.adicao[x.key] ? json.adicao[x.key] : json.adicao[1][x.key] + json.adicao[0][x.key]; 
              json['frete'] = this.addDotMoeda(frete); 
              objRowReturn[x.name] = this.convertMoeda(frete, this.getMoeda(json.adicao['condicaoVendaMoedaNome']));
              break; 
            case 'despesa':
              var despesa = (json['fobDot'] + json['frete'])/100*10
              json['despesa'] = despesa;
              objRowReturn[x.name] = this.convertMoeda(despesa, this.getMoeda(json.adicao['condicaoVendaMoedaNome']));
              break;  
            case 'lucroEsperado':
              var lucroEsperado = (json['fobDot'] 
                + json['frete']
                + json['despesa'])/100*10
              objRowReturn[x.name] = this.convertMoeda(lucroEsperado, this.getMoeda(json.adicao['condicaoVendaMoedaNome']));
              break; 
            case 'impostosEmReais':
              var result = 0 ;
              if(json.adicao.length) {
                json.adicao.forEach(x => {
                  result +=  this.addDotMoeda(x.pisCofinsBaseCalculoAliquotaICMS) 
                  + this.addDotMoeda(x.iiAliquotaValorRecolher)
                  + this.addDotMoeda(x.pisPasepAliquotaValorRecolher)
                  + this.addDotMoeda(x.cofinsAliquotaValorRecolher)
                  + this.addDotMoeda(x.ipiAliquotaValorRecolher)
                  
                })
              } else {
                  result +=  this.addDotMoeda(json.adicao.pisCofinsBaseCalculoAliquotaICMS) 
                  + this.addDotMoeda(json.adicao.iiAliquotaValorRecolher)
                  + this.addDotMoeda(json.adicao.pisPasepAliquotaValorRecolher)
                  + this.addDotMoeda(json.adicao.cofinsAliquotaValorRecolher)
                  + this.addDotMoeda(json.adicao.ipiAliquotaValorRecolher)
              }
              // eslint-disable-next-line no-debugger
              debugger
              objRowReturn[x.name] = result.toLocaleString('de-DE', { style: 'currency', currency: 'BRL' })
              break;    
            default:
               objRowReturn[x.name] = x.key ? (json[x.key] ? json[x.key] : json.adicao[x.key]) : 'Não Encontrado';
          }
        //}catch (e) {
        //  objRowReturn[x.name] = '';
        //}
         
      })
      console.log(objRowReturn);
      return objRowReturn;
    },
    getMoeda(stg) {
      if(stg) {
        return stg.includes('EURO') ? 'EUR' : 'USD';
      } else {
        return 'USD'
      }
    },
    convertMoeda(valor, moeda) {
      return this.addDotMoeda(valor).toLocaleString('de-DE', { style: 'currency', currency: moeda })  
    },
    addDotMoeda(valor) {
      if(valor) {
        return  parseFloat(`${valor.toString().substr(0,valor.toString().length - 2)}.${valor.toString().substr(valor.toString().length - 2)}`)
      } 
      return 0;
    },
    xml2Json(xml) {
      if(parser.validate(xml) === true) { 
        var jsonObj = parser.parse(xml);
        return jsonObj
        //ListaDeclaracoes
        //declaracaoImportacao
      } else {
        return {}
      }
    }
  }
}
</script>

import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
import { print } from 'pdf-to-printer'
import { LabelDTO } from './DTO/print.dto';

const request = require('request')

@Injectable()
export class AppService {
  async printFunction(labelObj : LabelDTO) {
    // Criando a variável dos dados da etiqueta
    let data = ``

    // Criando a variável de Data e Hora
    const date = new Date()
    const formatedDate = `${date.getDate()}/${ ( date.getMonth() < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1}/${date.getFullYear()} - ${ ( date.getHours() < 10) ? `0${date.getHours()}` : date.getHours()}:${ ( date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes()}`

    // Fazendo a identificação do tipo de Label e setando os seus respectivos dados
    if(labelObj.label == 'A') {
      const { client, label, grid } = labelObj
      data = `
        ^XA
        ~TA000
        ~JSN
        ^LT0
        ^MNW
        ^MTT
        ^PON
        ^PMN
        ^LH0,0
        ^JMA
        ^PR8,8
        ~SD15
        ^JUS
        ^LRN
        ^CI27
        ^PA0,1,1,0
        ^XZ
        ^XA
        ^MMT
        ^PW799
        ^LL1199
        ^LS0
        ^FO28,42^GFA,729,3424,32,:Z64:eJztlT1u4zAQhSmtCQTcYl14ekMlr5BGAbK9C899BFeLPYWQiuARkiJXyTECeLHJ8E8SFQ5VpPWAlgmNPj4+DkEKcYtbTKGGeh77ev76Vk03eKrmf368V/MSz3X+5flb/K+P/9U8bPD317o+IJZe39X1d491fW1Tr+wfIPXK/q0dJv1/hWnNk5ZZ/XZf+B/XZf268NcsTJf2Tzvz4nVYJMyQ+AKV8WMxMSZ9qPKK4+O0JNZ3LfHGTUJZ16WOtqO2RqdBPU8mJLr1pwZ4ojYNOvODskY5np7GpqrSpjkTT2Sf8WlVtaVPPT9O+sTrtKoAcBANgIS9hAM1gL1vK/6vl/Vk0B/W+qdcv5/mH/VN5j+tKvnH4L/ME26HxC/1I4+BP8vUcr7N+KX/wDdUf+KB9Mk/8eSf+H3aFe2F+LHkP/IPpN9X9J8iz/iXPfEn3r8aiTcL/zbXTzynr0hs5r/6d5WGPV9/baI+498tFp55fW3cBuL9Jz76b9a8A2eeJrLSd5KIkz7DX5K+WPtHMo4w1V/Aqv7OuOeDf6FyfT9xxIekL8RKv+vazv/a7uh4cey6I/XpKdYhN+4/z1di6/7a4qnspdd3Q+zoDZ47CRNlGf6wwauAKY4XwbZkb4JwBWruJCfSPWkflNPuEDF//EHCfIAxmLQ/BF1w+TgAX76A88vfeL5n8/4Y5+z7Afw9UImqvIvf9c13i0J8Apfpg/o=:5A97
        ^FO286,48^GFA,697,3904,64,:Z64:eJzt1D2OqzAUBWAjFy7ZQdhIBm8rRRRAFFPODma2AqKgnB082XJByUUUcSTkO9eYn8lTmlc+iZP2fmCO7TB25H8OV/IkGq0tRNgZgyUWqJAhExW3bGIscRGOmCeRBVmh8sBlFVeLF7B7YxpsUNOvwFxUseO4eiULC5lCCB4E7P7T+8n7e4OGtKGnVKJKUGC++wkQ0AZvX3mI7qUZzQCi7VpFPom/ydMSuAHyw2DtRJ6r67T5GOQf7x15hqUeNfnmvaH1y+TjvQpeQ1a4AZS9Bn+NN29/ex48LZ76S+MvsfuaPFt9GttXPiPv12+FDZ4GlvV77174k5XOe6T+8hs3I/VXIsfdW/Ko7jW1V63fn542f33yc/8F1r5/8rJa/UgTWeh/9tfNv82+957e2/i9x+pvn480IWHe/ycvp837/rDsC2CxitXm/ff3BdIEt/P5815Omz/PvvP7j6XiXR3e8dR/VyNNMGtZ8Lfdu1++D16UXame9p/80A1q81Ta4i/p2cXNOHveNuQ1xG2/nr/vPHhTD91I54+G5vN3SXd/y2qsjb9/rVHcaOywpf7wi84/eef3n7wZELzHRmV295J8vvgyeH+Lc4EfdP92/zCAavVwkYuH5JxmLIs0+b4cFdcDKsccE1ja6LF4fc8fGmS++gqSf/yfOXLkyJEjR44cORLyA2NiKRs=:EE8E
        ^FO286,83^GFA,1681,6592,64,:Z64:eJzt1zFv20YUAOB3eQHp4UJ6pBHCNPoLzjDQMIBhOgjQ30HBS0cFWRwgMKkqkDoI9tqp/Qv5Bz2WgLQY7dqtFAR0pqGFgVWz7+4kxWykNE3QjW+wKJIfeXp8vHsGaKONLw9MzSdLV3sc/Ve+P6WTwoehz49kwwdFw4fQXXr8Xm/ssPKEla4WqG4QlU1fbfG2PgChXSZYBXLtRdgYj/f+q/LHUC79Q3OhytmdDf1Qj/LBqfJe0/MtfnnK7z5kAy5i9cWK/9V/zd42veeRd0TXeCnIR8jLUojf4F26IB9g+JofXUl4LSvlL9jcLjo/IiWNUqD8yIqF8jSMmH5/0n90WwnxR++v/h35KD+v+ZOfCrjL7uAJe1vjrVt2frarYLogL+CMN3z3We489oW4yYdDGzy/m2c5P97tsjwfwBGK/tDdCTuzN3549ob8kTxp+KiA3HG4EEWOA6T8x2e93igEwXo5Ks8GdNVOlnJxRMaLymTlPU9IVT855+TlmI1YGpTyDNmI8oIwRjgcCDaiq3Z6KY+1Pxaz0X0vCrfhZT3DeiSwRJjUygcjZBX5RXIjVX3sZddLHyxESr8/ue89MD4wXlyLeoQu+eEiKVX+xV668tFij7wom14iUmaO1fipOq4PpyPcp/Ff8Rj8phdc+VBu8mLpvz3sjdAjPyJvGf8r7+r6i63Hqv6M78qJzj8UiKn2vQkdPT/sXdrGd7X3nmbjZf3GlmuB8KfKh6U0zx+6z1nGRaie/3fK50PXDzu9Sz/8yhKqPtbvT2w55LnOHz23TNcfRDnUnPKn64/GUfdvTf6C2YK8W6zfX4kWeetYeVdI+Y4K3IOgDxdcuILqf6H8q97c/qHT61+7WXUAni3X88enBq63Dv4L2+Djz/LWeuv0c/hD57Puug578WUeyy/zbbTxP0UoP3qYf/QoSEt5e3WNINUfWLyAZR9jvNunF+iEJi2osAA9/xgQc+X1maoJSMyF3LKGZR9jfJTTjsSuouzOLkHPfyuvWgTvYOmLUzPo3UtY9jHGi+c2wGwAYjp0QtDz731vlsL33ZvpR3QfYnyMdCgbqA3u0QJC/Ys5k1qXe341y23xY+19Glg2dlZeZBX5BS+TIEWwXqJbkr8A1cdEiNwulp6l2tNV9fq39vkCQnb3qEoiaYE1R7egRbJG1cckfaRVhU7rbvOeEL844DPb9b2DwgK7jzRDO9DXfcyzHHmoshjSgsjSSUHP+wNPd3UBHcpLTJ5WXgl2ynQfA+R1c7ePNiV3Um3xKJEbb2nPCtPHKB+rDNq0LLJUhizlTc9jIS/ouUfk7UJ79RC7ge5jXOPJ5pXyvg0hZaXp8zuAFzX5yHjVSoe17iOSlYeZKg7JOcQf+AmVxRGtv955bGtPu/em2per8cOZ8VQtzfFbUoxp80j9/jhG5dWRvZ7pYxpe9X8s9T0ID7NLvtGnFtrG6z5G5rbJv/KQpT7doVm/ViomDhy8HJLvFqz4Bq84S3ef5rqPmeZX5vmfzqiQZ29C8s33B1OVv2hK+Quoja3HrHZv6MnVuo9JstrUX5KTT+j/jnk9bLy/5LM/adqYU/uyT53wAObBDbjyle5jjuWc67klQtiBE7sg32/MH5uCbdy7sx38I3DjXm/j3k3xYOPe3U/2bbTRRhtttNFGG21sj78B7L4hiQ==:FD68
        ^FO48,384^GB704,0,2^FS
        ^FO48,780^GB704,0,2^FS
        ^FT7,314^A0N,70,71^FB792,1,18,C^FH\^CI28^FD${formatedDate}^FS^CI27
        ^FT0,1142^A0N,54,53^FB749,1,14,R^FH\^CI28^FD${client}^FS^CI27
        ^FT0,519^A0N,70,71^FB797,1,18,C^FH\^CI28^FDLabel ${label}^FS^CI27
        ^FT0,713^A0N,70,71^FB749,1,18,R^FH\^CI28^FDGrid: ${grid}^FS^CI27
        ^PQ1,,,Y
        ^XZ
      `
    }
      
    if( labelObj.label == 'B') {
      const { client, label, container, plp, grid, packages } = labelObj
      data = `
        ^XA
        ~TA000
        ~JSN
        ^LT0
        ^MNW
        ^MTT
        ^PON
        ^PMN
        ^LH0,0
        ^JMA
        ^PR8,8
        ~SD15
        ^JUS
        ^LRN
        ^CI27
        ^PA0,1,1,0
        ^XZ
        ^XA
        ^MMT
        ^PW799
        ^LL1199
        ^LS0
        ^FO28,42^GFA,729,3424,32,:Z64:eJztlT1u4zAQhSmtCQTcYl14ekMlr5BGAbK9C899BFeLPYWQiuARkiJXyTECeLHJ8E8SFQ5VpPWAlgmNPj4+DkEKcYtbTKGGeh77ev76Vk03eKrmf368V/MSz3X+5flb/K+P/9U8bPD317o+IJZe39X1d491fW1Tr+wfIPXK/q0dJv1/hWnNk5ZZ/XZf+B/XZf268NcsTJf2Tzvz4nVYJMyQ+AKV8WMxMSZ9qPKK4+O0JNZ3LfHGTUJZ16WOtqO2RqdBPU8mJLr1pwZ4ojYNOvODskY5np7GpqrSpjkTT2Sf8WlVtaVPPT9O+sTrtKoAcBANgIS9hAM1gL1vK/6vl/Vk0B/W+qdcv5/mH/VN5j+tKvnH4L/ME26HxC/1I4+BP8vUcr7N+KX/wDdUf+KB9Mk/8eSf+H3aFe2F+LHkP/IPpN9X9J8iz/iXPfEn3r8aiTcL/zbXTzynr0hs5r/6d5WGPV9/baI+498tFp55fW3cBuL9Jz76b9a8A2eeJrLSd5KIkz7DX5K+WPtHMo4w1V/Aqv7OuOeDf6FyfT9xxIekL8RKv+vazv/a7uh4cey6I/XpKdYhN+4/z1di6/7a4qnspdd3Q+zoDZ47CRNlGf6wwauAKY4XwbZkb4JwBWruJCfSPWkflNPuEDF//EHCfIAxmLQ/BF1w+TgAX76A88vfeL5n8/4Y5+z7Afw9UImqvIvf9c13i0J8Apfpg/o=:5A97
        ^FO286,48^GFA,697,3904,64,:Z64:eJzt1D2OqzAUBWAjFy7ZQdhIBm8rRRRAFFPODma2AqKgnB082XJByUUUcSTkO9eYn8lTmlc+iZP2fmCO7TB25H8OV/IkGq0tRNgZgyUWqJAhExW3bGIscRGOmCeRBVmh8sBlFVeLF7B7YxpsUNOvwFxUseO4eiULC5lCCB4E7P7T+8n7e4OGtKGnVKJKUGC++wkQ0AZvX3mI7qUZzQCi7VpFPom/ydMSuAHyw2DtRJ6r67T5GOQf7x15hqUeNfnmvaH1y+TjvQpeQ1a4AZS9Bn+NN29/ex48LZ76S+MvsfuaPFt9GttXPiPv12+FDZ4GlvV77174k5XOe6T+8hs3I/VXIsfdW/Ko7jW1V63fn542f33yc/8F1r5/8rJa/UgTWeh/9tfNv82+957e2/i9x+pvn480IWHe/ycvp837/rDsC2CxitXm/ff3BdIEt/P5815Omz/PvvP7j6XiXR3e8dR/VyNNMGtZ8Lfdu1++D16UXame9p/80A1q81Ta4i/p2cXNOHveNuQ1xG2/nr/vPHhTD91I54+G5vN3SXd/y2qsjb9/rVHcaOywpf7wi84/eef3n7wZELzHRmV295J8vvgyeH+Lc4EfdP92/zCAavVwkYuH5JxmLIs0+b4cFdcDKsccE1ja6LF4fc8fGmS++gqSf/yfOXLkyJEjR44cORLyA2NiKRs=:EE8E
        ^FO286,83^GFA,1681,6592,64,:Z64:eJzt1zFv20YUAOB3eQHp4UJ6pBHCNPoLzjDQMIBhOgjQ30HBS0cFWRwgMKkqkDoI9tqp/Qv5Bz2WgLQY7dqtFAR0pqGFgVWz7+4kxWykNE3QjW+wKJIfeXp8vHsGaKONLw9MzSdLV3sc/Ve+P6WTwoehz49kwwdFw4fQXXr8Xm/ssPKEla4WqG4QlU1fbfG2PgChXSZYBXLtRdgYj/f+q/LHUC79Q3OhytmdDf1Qj/LBqfJe0/MtfnnK7z5kAy5i9cWK/9V/zd42veeRd0TXeCnIR8jLUojf4F26IB9g+JofXUl4LSvlL9jcLjo/IiWNUqD8yIqF8jSMmH5/0n90WwnxR++v/h35KD+v+ZOfCrjL7uAJe1vjrVt2frarYLogL+CMN3z3We489oW4yYdDGzy/m2c5P97tsjwfwBGK/tDdCTuzN3549ob8kTxp+KiA3HG4EEWOA6T8x2e93igEwXo5Ks8GdNVOlnJxRMaLymTlPU9IVT855+TlmI1YGpTyDNmI8oIwRjgcCDaiq3Z6KY+1Pxaz0X0vCrfhZT3DeiSwRJjUygcjZBX5RXIjVX3sZddLHyxESr8/ue89MD4wXlyLeoQu+eEiKVX+xV668tFij7wom14iUmaO1fipOq4PpyPcp/Ff8Rj8phdc+VBu8mLpvz3sjdAjPyJvGf8r7+r6i63Hqv6M78qJzj8UiKn2vQkdPT/sXdrGd7X3nmbjZf3GlmuB8KfKh6U0zx+6z1nGRaie/3fK50PXDzu9Sz/8yhKqPtbvT2w55LnOHz23TNcfRDnUnPKn64/GUfdvTf6C2YK8W6zfX4kWeetYeVdI+Y4K3IOgDxdcuILqf6H8q97c/qHT61+7WXUAni3X88enBq63Dv4L2+Djz/LWeuv0c/hD57Puug578WUeyy/zbbTxP0UoP3qYf/QoSEt5e3WNINUfWLyAZR9jvNunF+iEJi2osAA9/xgQc+X1maoJSMyF3LKGZR9jfJTTjsSuouzOLkHPfyuvWgTvYOmLUzPo3UtY9jHGi+c2wGwAYjp0QtDz731vlsL33ZvpR3QfYnyMdCgbqA3u0QJC/Ys5k1qXe341y23xY+19Glg2dlZeZBX5BS+TIEWwXqJbkr8A1cdEiNwulp6l2tNV9fq39vkCQnb3qEoiaYE1R7egRbJG1cckfaRVhU7rbvOeEL844DPb9b2DwgK7jzRDO9DXfcyzHHmoshjSgsjSSUHP+wNPd3UBHcpLTJ5WXgl2ynQfA+R1c7ePNiV3Um3xKJEbb2nPCtPHKB+rDNq0LLJUhizlTc9jIS/ouUfk7UJ79RC7ge5jXOPJ5pXyvg0hZaXp8zuAFzX5yHjVSoe17iOSlYeZKg7JOcQf+AmVxRGtv955bGtPu/em2per8cOZ8VQtzfFbUoxp80j9/jhG5dWRvZ7pYxpe9X8s9T0ID7NLvtGnFtrG6z5G5rbJv/KQpT7doVm/ViomDhy8HJLvFqz4Bq84S3ef5rqPmeZX5vmfzqiQZ29C8s33B1OVv2hK+Quoja3HrHZv6MnVuo9JstrUX5KTT+j/jnk9bLy/5LM/adqYU/uyT53wAObBDbjyle5jjuWc67klQtiBE7sg32/MH5uCbdy7sx38I3DjXm/j3k3xYOPe3U/2bbTRRhtttNFGG21sj78B7L4hiQ==:FD68
        ^FO48,384^GB704,0,2^FS
        ^FO48,780^GB704,0,2^FS
        ^FT7,314^A0N,70,71^FB792,1,18,C^FH\^CI28^FD${formatedDate}^FS^CI27
        ^FT0,1142^A0N,54,53^FB749,1,14,R^FH\^CI28^FD${client}^FS^CI27
        ^FT0,519^A0N,70,71^FB797,1,18,C^FH\^CI28^FDLabel ${label}^FS^CI27
        ^FT48,713^A0N,70,71^FH\^CI28^FDContainer: ${container}^FS^CI27
        ^FT85,1025^A0N,56,56^FH\^CI28^FDNº da PLP: ${plp}^FS^CI27
        ^FT0,713^A0N,70,71^FB749,1,18,R^FH\^CI28^FDGrid: ${grid}^FS^CI27
        ^FT85,909^A0N,56,56^FH\^CI28^FDNº de Pacotes: ${packages}^FS^CI27
        ^PQ1,,,Y
        ^XZ
      `
    }
    
    // Variáveis da request na API da Labelary para a conversão de ZPL para PDF
    const convertUrl = `http://api.labelary.com/v1/printers/8dpmm/labels/4x6/0/`
    const options = {
      encoding: null,
      formData: {file : data },
      headers: {
        'Accept' : 'application/pdf',
        'content-type' : 'application/x-www-form-urlencoded'
      },
      url: convertUrl
    }

    // Fazendo a request na Labelary e salvando a etiqueta em um arquivo chamado label.pdf
    request.post(options, (err : any, res : any, body : any) =>{
      if(!err && res.statusCode == 200){
        fs.writeFileSync('label.pdf', body)
        return body
      }})

    // Instânciando a variável de identificação da impressora a ser utilizada para escolher a impressora mais próxima ao Grid
    let printerName : string = ''
    switch (Number(labelObj.grid)) {
      case 0:
        printerName = 'HPRT HT300 - Ethernet'
        break
      case (38 || 39):
        printerName = 'HPRT HT300 - USB001'
        break;
      default:
        break;
    }

    // Objeto de configuração de impressão
    const printOptions = {
      printer: printerName,
      scale: "fit",
      monochrome: true
    }
    
    // Esperando 2 segundos para garantir que a response da Labelary chegou, e após o intervalo imprimindo o arquivo .pdf
    setTimeout(() => {
      print('label.pdf', printOptions).then(() => {
        console.log(`Impresso em ${printerName}`);
      })
    }, 2000)
  
    return `Impresso em "${printerName}"`
  }
}

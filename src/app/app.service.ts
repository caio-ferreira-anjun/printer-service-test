import { printFile } from '@grandchef/node-printer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs'
// import { print } from 'pdf-to-printer'
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
     // const { client, label, container, plp, grid, packages } = labelObj
      /* data = `
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
      ` */
      data = 
      `
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
      ^FT285,92^A0N,25,25^FH\^CI28^FDANJUN EXPRESS LOG. E TRANSP. LTDA^FS^CI27
      ^FPH,3^FT285,128^A0N,18,18^FH\^CI28^FDAv. Raimundo Pereira de Magalhães, 16800^FS^CI27
      ^FPH,3^FT285,151^A0N,18,18^FH\^CI28^FDVila Santa Cruz, São Paulo - SP, 05220-000^FS^CI27
      ^FO70,384^GB672,2,2^FS
      ^FO70,778^GB665,2,2^FS
      
      ^PQ1,,,Y
      ^XZ


      `
    }
    
    const pedrosZpl = `^XA
    ~TA000
    ~JSN
    ^LT0
    ^MNW
    ^MTT
    ^PON
    ^PMN
    ^LH0,0
    ^JMA
    ^PR4,4
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
    ^FO52,60^GFA,741,2408,28,:Z64:eJzFlU1q5DAQhS3ThsZZxA2pfZjV4FP0ETrQuo/IyugUZlZNHWFyoZxhApN5VbJsuS0ZJgxMIf/I0vOnp7LkqvqP0bpyG5Wb6rex2Gbspdj28PlebGv2dB8/d3TXYtvj5+8v6R7e/oZ3HNzCc3eN57Ku5THyPn5tKMvd/bwkutV8Ou0dgds89LNulb/6GSeieaCbvDPf5lu3PD4OONmdrPWLLg3l7emYuaoGBBCDFocyHJ3qMIuHg3Q7yDWU8F7VMb8ybm8t33p2PWoiM0RPEJMhzEvX0IUsLBuKOgedVxEKqvIWGbxRnrWYVuQBxdqztWFqow49I29MdFZ06GlUJ7w73ZrnZfCqOyvvsuJdJ92oPF75CzoAlNAZgq4j0tpTmE6MaetPdN3Mu2543/sNb5x1JAnc+hMd+mV4wd910iW8KvK4lwTm/V0aok7zB3/In/pDTf15ngh3/pB4UPDurL+a2w0v+jPWBF3wZ1J/bZ6n/hqriS/wXjmOrNZPZvHXwIqlOX8mzV8ro5Ij8Ko0f428XY7Aq1JeH3WBV/WJv9MJBUdnUKAznT5BDTzvvPeDl5PwjoM+cX5Yr9K9/brNr/ygQyK/pMvwnqfrsrNtgzK6+NvjHZ6dd9Ilap4uOZ4JZ5v7b3oenKz5dP+c43pWnM00wRn/4ILO2JcT2fxvTL5t1g0xE1gUtrQB1xz2i2ycLGXtSfjSMCdi8W/7LTub/zz+AKM7ejk=:5E14
    ^FT217,77^A0N,28,28^FB582,1,7,C^FH\^CI28^FDANJUN EXPRESS LOG. E TRANSP. LTDA^FS^CI27
    ^FO278,84^GFA,1213,3360,60,:Z64:eJztls2KGzkQx0sIpIvSfRWksV9BJhcHhvGrlDHsaWENuezBJB0MzmXIOYeQZ1HTkNPAvoLCwuTqU/DCMN5/qd3+woRJAoFlUwejLumnqpJKVSb6Jf8nMWfffDSMZ3NafuyaVDywk1pGVc+a3QYcVcoDp9fXal3WNgPjE3YUz9i0Y/WfeXBlaabfVdGKDeNPfA5HzoG1e3an+72g6dJ57lh3yvIpq85Y56hZucBP6hjBlnXzz5rjg/piE9iFihtndaIhL8i+TtfQR36QIDeZnQrr4rSGzz42f405ftYfigCfP1p14yoT6Hn6SHbJM/3BMX/W3je3YJ+mFwasz+yYYrPyHFtbVJ5GzdJo4zwFmn9akmlZ24KYW/IBq8kN5teZTc8QEQLqWAMXaKJ2LGKcZpYMzgEsdWwVZpllsIZtPGKD2hr94Lxag92S+Y2HxugEdjNJMON8yGc1EbsmVHTC1kZjhRW7tbBzY+B0q+tAY2G7cw5hIGyIF1gXOvaKRY94jQ/kDnY71mc2gC3O2E87tjhmXWgkNzgMNNjnNdhRbPVA7ohao1bOF0yj1GKW7/Sgitza4KfvPbmCZ0vkJHsH1g0l3mFsu9ygl0T3jmxEbrwUdqG+lDXiTWXcwLSN+S3QI+XwNsNjkb0cMv5HWP5mtvpmYi96/f3sL/nvSvz69HmHOgiHFLtil8Xu8semK/yWac/qtXSpTZm611fWCxSwzBYy7eiQ8gX9IV/zPWulS6lbR39bX0Wq4p1F0RGfXc/2janbw4U9a6RLoZiQqlFtyOcCxML6fn3/OLs9cok2u82wEkVbWIyCNLPAHDeYudabyTLRnKrA21oUCmo/1MbYLuqLbHOD8Gb6vUP/YZoH1pQVN/B5tERlDjle+CysJt+zPnJEVSOt0d2E5cBGlmprcFboLqYSz3U9EraMZyxJ1xeWOtZlBVpQKcul2kPSBBvg70MhnnXsk5rjAswQrPQfYaW+SAtC1OUys69wiiGzwVMM0/uebWA4zMHanV2xE+aZHe/t+h2LpnFkt4WPoQXrpCWwXLkoMjtdnrM4yZ61dMKOCV2Vj9jXqyNWrWgeDfW5Iew7ko7j0GZQStHN8/Sd3BG9UG+7O3KIN6pbksk+J3FyzRoHutDOvonyFsq0daJQOWXoocsNmxAo3kLcvrnv38LFx+UuasE+Qn6E9Re1+jHoz5B/AQ0MWiA=:BCAB
    ^FO43,921^GFA,273,608,16,:Z64:eJzV0b0NwjAQBWBHLq4jDMDPGkEK8kqhwgiUOEpByUqOGIAVjChojWhScbxLSMECSLj7iud3p1Pqv57pDsmF7y/Nbhm0H80NuyrqAJejWZyrMvEZNWefxClFeCuuzx5hKuCqHkxu8H60UhML79ohn8KZMnF3hY8NwwuxFaMvpW6Wix8w5hPPkLeb3h7Oe6/gE6yseYnX/X/o+3gufbCzFYvToZ+8LdLRMn+wBWFfS+Ib19xFcrCG3VP2D182bdDu1/d6AwSihV8=:468D
    ^FO57,965^GFA,421,3080,88,:Z64:eJzt1LFqhEAQBuBZFpxmcNuBCPcKd90VgbyKj2BIe+CBbbi0F8jDbCq7PIMPkMIykJDN6AoKMQlxN6n8QZEVP39WGYA1a9b8VzRa7ZpPy+rY31zuIjWjm42v611c7m4g9xwB8LjsmybL3Rso5lzfNF3uamznXN+UAtys63ugl/Kxdfd2e4jlsriqNg9lvXdne/0EE5G/efBHV/ZBVXcJATHbXMdyjbhanbybN4PrxW2AK0eG6oTetZHdW3EvmQtr/PK+PxehrhNXvzHvjg4mTfNANwFCSmUfdlUFk6ZNoIudS+JeVMP++qY20NWdm3UuDm7fVMVxM+YNDiOsF/2wDHBVJd+N5H9ItYnpgiPE+tmcU/UKoxgw1r/IX7nBY30mV04CpZzeobtswbjfpY3aZ81cPgADG3rg:158E
    ^FO52,1000^GFA,449,3080,88,:Z64:eJzt1LtqwzAUBmAZQbSIZNVgyCtoPF3iV1GnrBo9BGwotEvpM6kYkq1zhg4H8gIZPZi4ujiNIe5Q2e3kH3yGY/j4fUGEzJkz57/CzIas2/s991NEu+l523PxtvcTol0paccpQsxtH5rKaJcALYfc0FTHuyIbdENTNcI9WZfitrqsXpqP5AkncqGy7hJ2p8vDodnTt+7Rg2jiXXmwLk9zqYgye3r9tUa7urCu4Nq7Fbu6XkzKeBfdBVyDdxdTubQMrgKVoKmeSe7Xifm+GRfmBmaNdddo3l9ZTW5NaTQbzgGUxLpaWTcN7yE0ZfGuZxCcq5Qxn6Jz/VzEu/7/R+FctO4RghuaLuNd3XPRmBqg15SPdXlq3UfrapFP4xbu+yOrFWwytTN6deyJ8cf6T/krd/Sxfp+ktampm2fmZkmK9ncpp+wzZyhf0kiqgg==:8361
    ^FO52,1034^GFA,445,3080,88,:Z64:eJzt1LFugzAQBmAjS2GxwsqAxCswukt4FXfK6pEhUixVapeqz+QKKdkyZ+hwUl6gIwMKPdukIIUOtWkn/uGGQ/r0AwZClixZ8l9J1Ibk3f2e2Zl6uxy2Ixe+95m76u0SSXtOEKKHtWta+LsFVVOuayoD3HLSdU1FgHtBl8K2viYv7Sl6gplcWaO75rvL9eHYHuhbf+tO1P4uHNFlWVUIIvSB3o5WqJurPbopk9at45trxUh5uxRwAGeSW3c1l2uPErqCiwh0/Uwqu42sSwNc8+KhbNHNQb+/xg0ZmlJ/1n4AUBB0pUA3c8/BNY1DXW5cIbT+SHvXzlWomxoX0D1z57qm6wC3GFzQuuF81JQFuMK4LEP3EV2ZVvO4pTZu3Ai+KcVOy+Q8Ev1/6z/lr9zg3/p9og7TUDM/YzMV2Xe/i5qzz5KpfAErIatK:39B4
    ^FO49,1068^GFA,349,3080,88,:Z64:eJzt1EFqwkAUxvH3GGg2YrYVLF4h7iINepWAC7fJBeo8BlyVdNvjzDCg14hk4dalK6Nt6bK8eaKW0nzrf36QIROAbt263WsJWvEzDwFNeoEbBzTZjdzpjdzZBe5I880z2heVTeEgcAd6pGqmmZBrzG6hKoE7sWWVcI3z5I0zkcBNbN7jmnTrwRtaqWu75QYaokriFnWAO97AHGVunhd91h2sP9y3VuC2+yzSnPv06b4K2LMbQc258dc5SFybKF1wbuShQVoJWLQpau77TZXXXujqxwAXnTNIknuh9NC/l5ZzbauQ6ChwobeMt4z7d7dsw/b9R41/Tva/+iL/YicPv490:0E35
    ^FO51,1103^GFA,397,3080,88,:Z64:eJzt1DFqwzAUgGGJB9UipNWDwFfwqKm+SnoDHaAQmzdkCblLb+DSoVvPkE5dk63QtI40ZcjTUxC0UPBbf/xhPyQLscwyy/zV9IP44XqAbLIT5x7gdah0Z+Y57w1TWdfAILLVO1ftyolxdVPtij3n+oIrP/XhkXZX9y2d0h66gqt29umNdsNHeyRTdJuSa5SlPze6EnOb8D6w7nrWYCrcfh/i1eBcB7ua952C5NwATm6FzbgK6RTdVVdwm+iSNyuehzXSKbrhBheQdh+ekU7R7Xx5D5DZ7/uIdErnoSm4GrYq476MSKd0fl3BNaCVIl1ARDql+6aAd9WdBvo8WLlBOqX/AxT+63DS8otK9iS+xyOZ/um0c2YuK+qv2nRDWua35gz3N4Vv:06A6
    ^FO13,420^GB774,8,8^FS
    ^FO13,794^GB774,8,8^FS
    ^FO13,911^GB774,8,8^FS
    ^FO52,434^GFA,437,1064,28,:Z64:eJzN0jFuwyAUBmAQld5mLuDaV+jowZKv0iMweqgULAaPvUHP0fFFDLkGUi5AlCVDZPrAxk4XD1WHvPUT8P73YOyJq9mxtx173zH8Uye/qvMi6NCFr5op0IfAHUwC63RzN4lgsiGZh2Dw4JMFEcZk+sHCLVorDcLAXEUmHUdxA2OP/iMZWARG9oqqiPYNgz26KplYrHabWZyNn2ernCo9R2ijabmajqZUqchKeu+0WhAuWq9aMlnCaB6M36I1quk5FhVlOGnIxqZorWoasoLmshmyLlqperJqtrUXJjVZoQ53jnWAz80sMogms43G6iJnZyIaqDBx7MJoTM4OZjHhXcWxicfsMrPa4ItcrCAT45BnPe8o9skvTnLsxWk4Lzvq7mQpH7sgmaImr3m39CdMmgu7InD0PFr9D7/tOeoHmVrQyA==:9913
    ^FO541,169^BQN,2,10,H,2^FDMA,TESTE^FS
    ^CFJ,32,40^FO52,516^FB710,6,0,L,0^CI28^FDTESTE^FS
    ^CF0,30,40^FO52,175^FB470,1,0,L,0^CI28^FDTESTE^FS
    ^CF0,30,40^FO52,210^FB470,1,0,L,0^CI28^FDTESTE^FS
    ^CFR,30,40^FO52,260^FB470,1,0,L,0^CI28^FDTESTE^FS
    ^CFJ,32,40^FO52,482^FB710,2,0,L,0^CI28^FDTESTE^FS
    ^GB220,70,70,,1^FO52,300^FS
    ^CF0,50^FO58,315^FR^CI28^FDTESTE^FS
    ^GB710,95,70,,1^FO43,808^FS
    ^CF0,80,60^FO43,825^FR^CI28^FDTESTE^FS
    ^PQ1,0,1,Y
    ^XZ`
    
    console.log(pedrosZpl.length);

    
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
        printerName = 'HPRT-HT300-32'
        break
      case (38 || 39):
        printerName = 'HPRT HT300 - USB001'
        break;
      default:
        break;
    }

    /*

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

    */
    // Esperando 2 segundos para garantir que a response da Labelary chegou, e após o intervalo imprimindo o arquivo .pdf
    setTimeout(() => {

      printFile({
        filename : 'label.pdf',
        printer : printerName,
        error : (e) => { console.log(e);
        },
        success : (jobId) => {console.log(`Impresso em ${printerName} - Id da impressão:${jobId}`);
        }
      })
    }, 2000)
  
    return `Impresso em "HPRT-ZPL"`
  }
}

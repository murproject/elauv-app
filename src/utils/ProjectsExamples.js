export default [
  // {
  //   name: 'Простые движения',
  //   description: 'Движения вперёд и назад',
  //   data: {},
  //   version: 0,
  // },
  // {
  //   name: 'Пропорциональный регулятор',
  //   description: 'Удержание курса с помощью<br>пропорционального регулятора',
  //   data: {},
  //   version: 0,
  // },
  // {
  //   name: 'Исследователь стенок',
  //   description: 'Ехать вперёд и назад до<br>удара в стену аквариума',
  //   data: {},
  //   version: 0,
  // },
  // {
  //   name: 'Кладоискатель',
  //   description: 'Дойти до чёрной зоны и<br>поднять монетку из сундука',
  //   data: {},
  //   version: 0,
  // },

  {
    name: 'Тест: светодиоды',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"7X^c$wgVI[Wk[pZ]E~C*","x":-325,"y":-403,"fields":{"NAME":"rgb"},"inputs":{"STACK":{"block":{"type":"mur_set_leds_all","id":"h|*b+ONBECNs}5rT~wqj","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"%5`/-o=Z?kV%Zl61=X#9","fields":{"Colour":"#000000"}}}},"next":{"block":{"type":"mur_delay","id":"O;1${8`Lw+c%B#OG;$h3","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"!cianw^KwFM7~Zzco31j","fields":{"Value":1}}}},"next":{"block":{"type":"mur_set_leds_all","id":"x#+gk@}7uia_~]BUrjIq","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"84,[iOfS_?TxbnDCoEeJ","fields":{"Colour":"#ff0000"}}}},"next":{"block":{"type":"mur_delay","id":"HoTC}qro5)3i.0,Ci73x","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"x4EP~nlX9Ob0W((ul9v#","fields":{"Value":1}},"block":{"type":"variables_get","id":"3lm()^SV]b@hJYX7ez8j","fields":{"VAR":{"id":",J-R`:/B3preT1R(g}q6"}}}}},"next":{"block":{"type":"mur_set_leds_all","id":"ca;lhPIjPfC)noKr@Qya","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"lyHLS+D_4p$N;^qtbW.k","fields":{"Colour":"#00ff00"}}}},"next":{"block":{"type":"mur_delay","id":"YG[vw@!M./u7Vf)?F.gJ","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"Q]2dn4UDo~fyw%W%doVg","fields":{"Value":1}},"block":{"type":"variables_get","id":"je;G3j@)eW0tIP*Ni[[i","fields":{"VAR":{"id":",J-R`:/B3preT1R(g}q6"}}}}},"next":{"block":{"type":"mur_set_leds_all","id":"(d@^T8![c+1vf6i_c%~t","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"Kvx3yWpM/5pBG-ZiM-{t","fields":{"Colour":"#0000ff"}}}},"next":{"block":{"type":"mur_delay","id":"Pdmt+5.gdgu|A;ZHDFrI","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"Y@f%/`Oru)qrAoU[~A;/","fields":{"Value":1}},"block":{"type":"variables_get","id":"$w*.M6/L@}RINJPmKU~u","fields":{"VAR":{"id":",J-R`:/B3preT1R(g}q6"}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"d_}(GI`,`jBUPRa(LI#p","x":-325,"y":39,"fields":{"NAME":"circle"},"inputs":{"STACK":{"block":{"type":"controls_repeat_ext","id":"91$pPMfH}+aK~YEJ1xZ]","inputs":{"TIMES":{"shadow":{"type":"mur_number","id":"Ji7Q[Wu]%[*gj}v(ZE4b","fields":{"Value":3}}},"DO":{"block":{"type":"controls_for","id":"UeK;|CNN3TJGM*=y:C?i","fields":{"VAR":{"id":"{4IRH{?{~J#{sD]FU]+S"}},"inputs":{"FROM":{"shadow":{"type":"mur_number","id":"T_{_aJX,k8lrt`*ec@9W","fields":{"Value":0}}},"TO":{"shadow":{"type":"mur_number","id":"owbnoKbby4yu~-}3l--/","fields":{"Value":3}}},"BY":{"shadow":{"type":"mur_number","id":"RP,s(Yu5Ra-+xi#[^lKF","fields":{"Value":1}}},"DO":{"block":{"type":"mur_set_leds_all","id":"WKVB@Hs(C@mF^XXAe@}C","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"M4g-MEM!V?4s?C{o_d3a","fields":{"Colour":"#000000"}}}},"next":{"block":{"type":"mur_delay","id":"Q{5%m}Y+%jh!KYmA}XsZ","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":")J/[brWyK$s:Z?P~JvE:","fields":{"Value":0.5}}}},"next":{"block":{"type":"mur_set_led","id":"IRk+u[~xE8~x8Y:[MqRN","inputs":{"Index":{"shadow":{"type":"mur_led_selector","id":"A%MtobH/1#bfKVOkb4|!","fields":{"Index":"0"}},"block":{"type":"variables_get","id":"~LcvDJzTi@tSmdpMeuo.","fields":{"VAR":{"id":"{4IRH{?{~J#{sD]FU]+S"}}}},"Colour":{"shadow":{"type":"mur_colour_picker","id":"j$)LFQGrb:[PXUtI0@~6","fields":{"Colour":"#00ffff"}}}},"next":{"block":{"type":"mur_delay","id":"h+Pf%8K.hk55$G0Zy[;W","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"R-Uh0l#uA{aF~ztcs|9?","fields":{"Value":0.5}}}}}}}}}}}}}}}},"next":{"block":{"type":"mur_set_leds_all","id":"Ojv$6us_=$:!x.cd.~ti","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"=3|cTwEdP9h:eiVLXI8@","fields":{"Colour":"#000000"}}}}}}}}}},{"type":"variables_set","id":"vciiO?gZOax,*.=h/o^.","x":-65,"y":-325,"fields":{"VAR":{"id":",J-R`:/B3preT1R(g}q6"}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"dU_2ELeAHw9BZ29eF1/X","fields":{"Value":2}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"wMXH@q:*2c)s/]5]s{_a","extraState":{"name":"rgb"},"next":{"block":{"type":"mur_loop_timeout","id":"ty-GK}Rj#}FI!9!f=Hcw","inputs":{"Delay":{"shadow":{"type":"mur_number","id":"mV^,pOu94gaTEr;a$`c4","fields":{"Value":3}}},"STACK":{"block":{"type":"mur_set_leds_all","id":"?b$0jGd~pLAUGFQ_#?*%","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"Xz?h+{`DE$T}@JISEoxX","fields":{"Colour":"#ffff00"}},"block":{"type":"colour_random","id":"LD0u5*nqnuU;gzA|Snz."}}}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"*qvg+P%E:G[#luJ1vkX|","extraState":{"name":"rgb"},"next":{"block":{"type":"procedures_callnoreturn","id":"V=a;YpTf)V~-1]F#:Bq,","extraState":{"name":"circle"},"next":{"block":{"type":"mur_end_thread","id":"GtOY).DgVHRbx8W|{:.a","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}}}]},"variables":[{"name":"задержка","id":",J-R`:/B3preT1R(g}q6"},{"name":"i","id":"{4IRH{?{~J#{sD]FU]+S"}]}',
    ),
    version: 0,
  },

  {
    name: 'Тест: лазер',
    data: JSON.parse(
        '{\"blocks\":{\"languageVersion\":0,\"blocks\":[{\"type\":\"mur_loop_infinite\",\"id\":\"={I|kvE}UG}j}Okirt7R\",\"x\":-91,\"y\":-169,\"inputs\":{\"STACK\":{\"block\":{\"type\":\"controls_if\",\"id\":\"3`f5E}*^c?SIPL]7Qk}g\",\"extraState\":{\"hasElse\":true},\"inputs\":{\"IF0\":{\"block\":{\"type\":\"mur_get_color\",\"id\":\"so)[yago0KuaSL$e@9xQ\",\"fields\":{\"MODE\":\"SENSOR_COLOR_WHITE\"}}},\"DO0\":{\"block\":{\"type\":\"mur_set_leds_all\",\"id\":\"(-.{BNp2#ugALJ~J}QKB\",\"inputs\":{\"Colour\":{\"shadow\":{\"type\":\"mur_colour_picker\",\"id\":\"Cm|Lmw+8U,?UDm!.-cWQ\",\"fields\":{\"Colour\":\"#ffff00\"}}}}}},\"ELSE\":{\"block\":{\"type\":\"mur_set_leds_all\",\"id\":\"h%=nCYS~;)YSl]`Ovpt.\",\"inputs\":{\"Colour\":{\"shadow\":{\"type\":\"mur_colour_picker\",\"id\":\"WdmPv+PoLymHoA8J}BAm\",\"fields\":{\"Colour\":\"#000000\"}}}}}}}}}}}]}}',
    ),
    verison: 0,
  },

  {
    name: 'Тест: магнит',
    data: JSON.parse(
        '{\"blocks\":{\"languageVersion\":0,\"blocks\":[{\"type\":\"mur_set_leds_all\",\"id\":\"+$}|uN%Xc]`8]odDU%31\",\"x\":-91,\"y\":-299,\"inputs\":{\"Colour\":{\"shadow\":{\"type\":\"mur_colour_picker\",\"id\":\"D~$pixaz]_WfjAF-Z-~.\",\"fields\":{\"Colour\":\"#ffff00\"}}}},\"next\":{\"block\":{\"type\":\"mur_actuator\",\"id\":\"}Cm7[*$u`Su`Oa2.^-jk\",\"fields\":{\"MODE\":\"SOLENOID_ON\"},\"next\":{\"block\":{\"type\":\"mur_delay\",\"id\":\"_``v6tQyh*#X!k1uB/GB\",\"inputs\":{\"sleepSeconds\":{\"shadow\":{\"type\":\"mur_number\",\"id\":\"dHlhS.jix5R5ar{N,Ees\",\"fields\":{\"Value\":60}}}},\"next\":{\"block\":{\"type\":\"mur_end_thread\",\"id\":\"#+U_d,6fn]5Y`i+{@nry\",\"fields\":{\"MODE\":\"MODE_END_SCRIPT\"}}}}}}}}]},\"variables\":[{\"name\":\"задержка\",\"id\":\"2d@,cvvqj$-;rpqU?To(\"}]}',
    ),
    version: 0,
  },

  {
    name: 'Тест: моторы',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"Ji0E85u)X1T]x87gy-,-","x":-455,"y":-429,"fields":{"NAME":"тест мотора A"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"q;bc/B,ald(n[ZrLNtUT","fields":{"Text":"Мотор"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"[39?|)?n:xs^QeMVD#AC","fields":{"Text":"A"}}}},"next":{"block":{"type":"mur_set_power","id":":nH;hk8bdj:+|qPrMpwt","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"R]Q-!bb_d)#D6CWEB?LJ","fields":{"Value":50}}}},"next":{"block":{"type":"mur_delay","id":"E1=Ej8i0gGjRPg12dbvq","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"pUDf6#N(9FnM0dCv5,f2","fields":{"Value":3}},"block":{"type":"variables_get","id":":.@8Fwmn]~b8=zV1U!C!","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"pbL(gQqHY[Tdv1amE_Fr","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"D[AF#]IDx*v[M%8OXz94","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_delay","id":"ezl!E|z7z.ILFsYFomhw","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"n_Tut4CBs79m|1B~9[gk","fields":{"Value":3}},"block":{"type":"variables_get","id":"q}O8v[(=;zX(/Ng?lol/","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"}2bb^zq]S2RalNi={OxV","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"Pgc52B6)Kt=@3fx.AQN6","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"x2((LLR~Z9!tc,^{E!qa","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"u{^@*DYfYqy*QSOLpAp3","fields":{"Value":3}},"block":{"type":"variables_get","id":"pvf4H_~b5oB]ZL#%lerc","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"x4|3wDt(B5B~,7g$!S#y","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"gHmJLn?L#!l}N]1mGSaa","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_delay","id":"JM9MzMj-3@Qi#p5^V@TK","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"Asf+ua?EUu:3D-cG]_-^","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_stop_motors","id":"jU/yd7UDjM:#u-;6I*@%","next":{"block":{"type":"mur_delay","id":"%49_JLGzMo@?RicN_iVv","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"@!}lCE)#93E*r8:H0W1;","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}}}}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"5AoQY-jRF?lzVg0m`d10","x":-117,"y":-429,"fields":{"NAME":"тест мотора B"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"9$RQij`vh`B00(z~7#`9","fields":{"Text":"Мотор"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"b+{)%d+XlVF(m6y5^M8o","fields":{"Text":"B"}}}},"next":{"block":{"type":"mur_set_power","id":"qfMUCesiqp.5A*Guf}$)","fields":{"Index":"MOTOR_B"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"$`XMRyfBEN6UDek-czMZ","fields":{"Value":50}}}},"next":{"block":{"type":"mur_delay","id":"+F2ex}N,AcCvGc#|,~/;","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"pUDf6#N(9FnM0dCv5,f2","fields":{"Value":3}},"block":{"type":"variables_get","id":"_V1e?vi`2Mw|`TxS1kwN","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"1qO~@,%X|_Hsk?Qbi72f","fields":{"Index":"MOTOR_B"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"yqLD+y1R]RzPh$}U,oc#","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_delay","id":"x3=.R,Q?6gA`,5:T*U:6","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"n_Tut4CBs79m|1B~9[gk","fields":{"Value":3}},"block":{"type":"variables_get","id":"q6^-.7P~d9q#k:f7Q.g#","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"3@(67l2_z{I3BHHIBH@[","fields":{"Index":"MOTOR_B"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"#:DlG-$,?EQB~P/6SLVp","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"|7.4Bj9Q4T!=/?I9Ha-1","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"u{^@*DYfYqy*QSOLpAp3","fields":{"Value":3}},"block":{"type":"variables_get","id":"4a3R*m9eb}`Ps]*y$UM7","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"B/wXB{l1ZD}F!5E8k|A6","fields":{"Index":"MOTOR_B"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"{Qo1z`P{{O9PLL)X4@z:","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_delay","id":"tc.9F9dwWVi5Q$QJZ=!H","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"d:RFcV7y)oJxTr_s}`;9","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_stop_motors","id":"V`jK8y@^(KR!3c`pKCrv","next":{"block":{"type":"mur_delay","id":")/F:(?u`Zv93JT#29WBY","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"SONo()qZS]X$RTlwp9^d","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}}}}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"UaT~9g2t|i#+KfCRG}Wb","x":-455,"y":169,"fields":{"NAME":"тест мотора C"},"inputs":{"STACK":{"block":{"type":"mur_print","id":"J4XLL4MPVcx?u}S*MwOH","fields":{"Text":"Мотор"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"mx8!J6}CwcRRu0?%(ylu","fields":{"Text":"C"}}}},"next":{"block":{"type":"mur_set_power","id":"NbEFb]2=JfO^=7;/2?C3","fields":{"Index":"MOTOR_C"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"%CwvWW/VG_QYP:$eY!!)","fields":{"Value":50}}}},"next":{"block":{"type":"mur_delay","id":"5SZjuy]C/28EJoORGl8l","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"pUDf6#N(9FnM0dCv5,f2","fields":{"Value":3}},"block":{"type":"variables_get","id":"6NWH3tSV6(OvM*zI@*In","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"1/jmp{XVZM1p)3l-)JO;","fields":{"Index":"MOTOR_C"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"0%IwRX%0lVwL#h`RHPd)","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_delay","id":"J@~Gnl`x9=XZ9RugTqo%","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"n_Tut4CBs79m|1B~9[gk","fields":{"Value":3}},"block":{"type":"variables_get","id":"UpX5V;v}Eu6USw}c{.}x","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"nCbjcieJvdW),)2);3Jo","fields":{"Index":"MOTOR_C"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"p8|Gs5JH$e*#bcp_0`Vx","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"DWhD8W0ca|x;_q7-?,Bz","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"u{^@*DYfYqy*QSOLpAp3","fields":{"Value":3}},"block":{"type":"variables_get","id":"p2q]si*AxDrr%CwJ5G7C","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"TRXr|9Gf[erRB^Pt3rV`","fields":{"Index":"MOTOR_C"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":":TRrb3z^Fq.^Z,.3OX~~","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_delay","id":"Uq3*7f=/%wwj:CHN:Jn7","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"AeI/mP`vM+^DZx?i{Dcb","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_stop_motors","id":"h3h`s*w/Kl@5=VGV!`J*","next":{"block":{"type":"mur_delay","id":"-WSFf*$HxILqmOAt!z-]","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"s1|T,+-EIreiA8js2}g/","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}}}}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"D:_b/Bfx%H`Z}?n0b/F,","x":-117,"y":169,"fields":{"NAME":"тест мотора D"},"inputs":{"STACK":{"block":{"type":"mur_print","id":";i.$8zct%SV[8ybP!R^^","fields":{"Text":"Мотор"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"h~UaJA}12Fw1%gaAR+|U","fields":{"Text":"D"}}}},"next":{"block":{"type":"mur_set_power","id":"u_W1]M-IeTlXztxm*4O-","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"Sf[4j4Ywl=KB!ImwbIFt","fields":{"Value":50}}}},"next":{"block":{"type":"mur_delay","id":")*cUpnmIfF=qO7Cza%JV","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"pUDf6#N(9FnM0dCv5,f2","fields":{"Value":3}},"block":{"type":"variables_get","id":"pUo7xbl5EG#cFk+Uxt4m","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"]`XybTGy(jehwoS1R:`d","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"?Kw:t[tCIJRtfa${H:dt","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_delay","id":"7ASw#AkPRJ-Vi^Xd`UyM","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"n_Tut4CBs79m|1B~9[gk","fields":{"Value":3}},"block":{"type":"variables_get","id":"!c+wX[9@C}?47Lhe+sd5","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"l#pY9Lp:^8GP5o)TDQPR","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"%[{7}+9_uO``Pnw))6I?","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"d|N{|Ab71KQ$YkUM^$Yi","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"u{^@*DYfYqy*QSOLpAp3","fields":{"Value":3}},"block":{"type":"variables_get","id":"*8|b]cZfI;{cgGH@w75g","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_set_power","id":"HQ.d:7|CpU~*oB[jsDzy","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"k$+/,dyAh:8gp8@ANcV[","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_delay","id":"Sy0ZMV,ZGw`AgiVk|O,X","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"Hf[|AB9e4hZ.y_m#sbUa","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}},"next":{"block":{"type":"mur_stop_motors","id":"b9tg#!iC#De73nda*uom","next":{"block":{"type":"mur_delay","id":"v!lm7).tt}wMiXo!VoU%","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"O,KwA;l::c5_5,o6}*/r","fields":{"Value":3}},"block":{"type":"variables_get","id":"gbEzVd?`pu#9e+3yZl+y","fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}}}}}}}}}}}}}}}}}}}}}}}}}}}}},{"type":"variables_set","id":"^S+gdbwK{$(X5]$idg9t","x":195,"y":-429,"fields":{"VAR":{"id":"2d@,cvvqj$-;rpqU?To("}},"inputs":{"VALUE":{"block":{"type":"mur_number","id":"n8`w/2wbqODP_ebL02(B","fields":{"Value":3}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"TZO6Q1Z#vMOviN$y7J88","extraState":{"name":"тест мотора A"},"next":{"block":{"type":"procedures_callnoreturn","id":"ZIxGl*YMOUpMOt;%.JXt","extraState":{"name":"тест мотора B"},"next":{"block":{"type":"procedures_callnoreturn","id":"O!uPf3O.u);572sLIM:s","extraState":{"name":"тест мотора C"},"next":{"block":{"type":"procedures_callnoreturn","id":"wS]DIKtVFU?w5WHJ=-zR","extraState":{"name":"тест мотора D"}}}}}}}}}}]},"variables":[{"name":"задержка","id":"2d@,cvvqj$-;rpqU?To("}]}',
    ),
    version: 0,
  },

  {
    name: 'Тест: моторы, скорость ±1%',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"mur_print","id":"f-bI@-z3K?6-rcZvXS[x","x":299,"y":117,"fields":{"Text":"Скорость"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":";)JCH]+Mv6dXR]LFXToZ","fields":{"Text":"Положительная"}}}},"next":{"block":{"type":"mur_set_leds_all","id":"n$#3!?%Sr;`V@zLehHAN","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"bbhb]==P[9%@P?T9W=k3","fields":{"Colour":"#ffff00"}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"2P.Va;Nz9zwd^08ex(w?","inline":true,"extraState":{"name":"Проверить моторы","params":["скорость"]},"inputs":{"ARG0":{"block":{"type":"mur_number","id":"SY`l55D#!{)3_~dwcU3d","fields":{"Value":1}}}},"next":{"block":{"type":"mur_print","id":"AC,Wvg.2Q/fAYQ80DU]G","fields":{"Text":"Скорость"},"inputs":{"Value":{"shadow":{"type":"mur_text","id":"i]Ow+R+K%el)0o0$y1kF","fields":{"Text":"Отрицательная"}}}},"next":{"block":{"type":"mur_set_leds_all","id":"=2W5:$+2aA!J9mEHEm#]","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":")O#0{Q3~X;b7lr.*3z;U","fields":{"Colour":"#00ff00"}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"`@eZ`VocFixPU?9!oMEc","inline":true,"extraState":{"name":"Проверить моторы","params":["скорость"]},"inputs":{"ARG0":{"block":{"type":"mur_number","id":"D8}w~{HK[cZpD=CU)a@t","fields":{"Value":-1}}}},"next":{"block":{"type":"mur_end_thread","id":"yGn:Lq-hz0*vx%S:K%_v","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"nvJqm$Yiu?g|M0b{eGbN","x":-39,"y":117,"extraState":{"params":[{"name":"скорость","id":"N@j,Sc7uoqr6.NpRtJ@0","argId":"~rKyo.?*ZjC/1HW/pl0I"}]},"fields":{"NAME":"Проверить моторы","~rKyo.?*ZjC/1HW/pl0I":"скорость"},"inputs":{"STACK":{"block":{"type":"mur_set_power","id":"g:)p@PkE~z;KYcM?oq%(","fields":{"Index":"MOTOR_A"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"CT*Kd]!,fIVTX9sQXovP","fields":{"Value":25}},"block":{"type":"variables_get","id":"{b:kOH#N:YBAe2P`H8{P","fields":{"VAR":{"id":"N@j,Sc7uoqr6.NpRtJ@0"}}}}},"next":{"block":{"type":"mur_set_power","id":"`q*6n9y5nohvkz9U,1xt","fields":{"Index":"MOTOR_B"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"nb4/U0Cz.7b[on.[}a.E","fields":{"Value":25}},"block":{"type":"variables_get","id":"8-zp81U)%#43%jza(tUj","fields":{"VAR":{"id":"N@j,Sc7uoqr6.NpRtJ@0"}}}}},"next":{"block":{"type":"mur_set_power","id":"1x)?c!5pD(6IGCudi@S6","fields":{"Index":"MOTOR_C"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"8Ss@ar3%r:ZU(-){`uO9","fields":{"Value":25}},"block":{"type":"variables_get","id":"1#m{DpZ`?R-b=CZhZ?wH","fields":{"VAR":{"id":"N@j,Sc7uoqr6.NpRtJ@0"}}}}},"next":{"block":{"type":"mur_set_power","id":"NaXvP9KZ(3t+=YCRU%|.","fields":{"Index":"MOTOR_D"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"$?{T3c(_yD#4mmjO0i#w","fields":{"Value":25}},"block":{"type":"variables_get","id":"W3u}bRE!-}+v0S;83R@;","fields":{"VAR":{"id":"N@j,Sc7uoqr6.NpRtJ@0"}}}}},"next":{"block":{"type":"mur_delay","id":"i@.Tr:{seRO[(z9P0@9U","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"MP,L66H+l:toFI3]^-_S","fields":{"Value":10}}}}}}}}}}}}}}}}]},"variables":[{"name":"скорость","id":"N@j,Sc7uoqr6.NpRtJ@0"}]}',
    ),
    version: 0,
  },

  {
    name: 'Тест: удары',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"Mq.ZHo(%0xQ#?T{KwH1S","x":-39,"y":611,"fields":{"NAME":"Мигнуть"},"inputs":{"STACK":{"block":{"type":"mur_set_leds_all","id":"m78{B=eoC%J)n4z@e8Mh","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"hw7fPK{%BhUOKnO/6o2k","fields":{"Colour":"#ffff00"}}}},"next":{"block":{"type":"mur_delay","id":"pN3~;agMID?L=5+;:@3B","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"Uz8RBp8H]51hF$tb(X@8","fields":{"Value":0.3}}}},"next":{"block":{"type":"mur_set_leds_all","id":"YYnYz/mWoP6WuL~ofq*=","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"kOM$FC#sW2Va0dTL]|el","fields":{"Colour":"#000000"}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"E@,~M(epV;0;D=ds^Oi5","x":-39,"y":195,"fields":{"NAME":"Удар об стенку"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"ar@o=X8i@W=`ZpB/=dVB","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"4{=[/TN=oHa7RbmVd^Ty","fields":{"Value":50}}}},"next":{"block":{"type":"mur_set_axis","id":"eAPZ5XD{:Y3riA$qT@Nu","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":":VJOW_QGDe1`^NPnqjcu","fields":{"Value":75}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"J{|N0+i*?+MZ,bfMF+4p","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_set_axis","id":"+`61|vnJ-e$^BmolSh(I","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"LM?8v,uFoyXtjD6JHh%;","fields":{"Value":0}}}},"next":{"block":{"type":"mur_set_axis","id":"E)MGP8{AiZ%4WN/:kfIs","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"*JpFLMZME~_}NH).GVVP","fields":{"Value":0}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"A=`Q(y(MlMR-1[p_z,/`","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_delay","id":",gxSBfQHkELwfmt|;_ez","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"Hdq`QaYs%m9*zBYuXmjD","fields":{"Value":1}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"n2+8RU[jRuSc[w(K4S3P","x":195,"y":195,"fields":{"NAME":"Удар об дно"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"x_,`Kq{xY@rI`9l{]|R@","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"jW$X^Qo7H[oPv)6!Uu.Z","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_delay","id":"(pHPd/OTs:JdiNx+omMF","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"vU498[d3pQV`z`%@T4S|","fields":{"Value":2}}}},"next":{"block":{"type":"mur_set_axis","id":"z-@RlMg6Qf_KeLC_0WrS","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"2!lBz^K/`e!INAVTBWVR","fields":{"Value":0}}}},"next":{"block":{"type":"mur_delay","id":"#DX8Djl_%8h}b#KSpUNH","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"iN$)Hi|+Q`Z0)yp=!.8@","fields":{"Value":1}}}},"next":{"block":{"type":"mur_set_axis","id":"~OD|uAg^7,Hp)8iy[[^y","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"f.j;Pvw+4[=7~d!|~.|d","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"v/^sDmp1MD|eU#ou0##P","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"tis*U#R$VG[X;[VoFn~I","next":{"block":{"type":"procedures_callnoreturn","id":"!Tx~/6mavDCvLM/{5xnc","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_delay","id":"ma:yxwpN)`iG_wqrOKg9","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"j5cLs9~T|W~J_YT=;J37","fields":{"Value":1}}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"@y[s937mjB@t[hqVv?[K","x":195,"y":689,"fields":{"NAME":"Всплыть"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"PXf][]l^$Apfmu$tb77o","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"(^IwPj`w#z60{(bTQ{mb","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"sc|4)Ni,ereV6LiC9gZP","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":";I]LZvd#mJ?l1#?)P^c8","fields":{"Value":4}}}}}}}}}},{"type":"mur_set_yaw","id":"24)D0Fd#20RL2Krq%GW.","x":429,"y":195,"fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"lWKjyqpif_kjcp*=rP$4","fields":{"Value":0}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"4f=GKvHyUrUP{ElphddU","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"GbB6UQM:UP()~i].ZK.)","extraState":{"name":"Удар об стенку"},"next":{"block":{"type":"procedures_callnoreturn","id":"06%q6f1q{OegB}kBG[:E","extraState":{"name":"Удар об дно"},"next":{"block":{"type":"procedures_callnoreturn","id":"fiY^RD6oefy!h*$R]+}~","extraState":{"name":"Всплыть"},"next":{"block":{"type":"mur_end_thread","id":"/-xY%m6gf;:dblwL)wn3","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}]}}',
    ),
    version: 0,
  },

  {
    name: 'Тест: регулятор',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"controls_repeat_ext","id":"(,AOtok%,{Pk^IjW[/y1","x":273,"y":169,"inputs":{"TIMES":{"shadow":{"type":"mur_number","id":"vhyBGthf#4Wf6gT:(J[J","fields":{"Value":4}}},"DO":{"block":{"type":"mur_set_yaw","id":"c$ZLQ:efK7,Weg}|3:X9","fields":{"MODE":"SET_YAW_RELATIVE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"_dDzz/Sef|18e-v7t{hP","fields":{"Value":90}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"M9#6`k(POV}o/@BKWwsK","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"EjKk6,rTQwR{S9tgkb},","extraState":{"name":"Мигнуть"}}}}}},"next":{"block":{"type":"mur_set_yaw","id":"$|.wahK?a4,(l8ph9sEv","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"_Jqf=FiQ1Chm7=*bFIg+","fields":{"Value":0}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"3/9tij/hPh?[`esOGybg","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"Ag4_k~OM5#I0tp5^:cV+","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_set_yaw","id":"g;VSa/QSD!+Y*p3q}WK#","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"A90#@f,[l6!D6MoKzf!2","fields":{"Value":-90}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"h3r$n)9O~I1xZ~U|9NeM","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"8eWeObIlu(4yq0fz~8;,","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_set_yaw","id":"vL#|Hb(!kn,8/-y4*V2.","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"YExylA+iL[va*,3^6{i!","fields":{"Value":180}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"0-?MZS?Al`[z){k|(.g@","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"RCLOv#:g#vjX$rppva[8","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_set_yaw","id":"k?Hga5Qn0a)G!jE@CUt(","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"JGzlW2Nl4FQs)UI:IQ$Y","fields":{"Value":90}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"P-]HG`i=|/wEz|m5_gPn","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":",]tOCN7rk:boWqw9;`qy","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_set_yaw","id":"2?a:WwTa~W?5MMWlsbaE","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":":BfJ]piHdDU]_P;A?[KB","fields":{"Value":0}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":"L##~s?1XGGHd91M(DrgP","fields":{"Value":75}}}},"next":{"block":{"type":"procedures_callnoreturn","id":"wnP+2Wk0+=VNF8ylh|oz","extraState":{"name":"Мигнуть"},"next":{"block":{"type":"mur_end_thread","id":"+{?%j6v^i]|t_a^CK[pK","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"aksBIXDnuo*Od,H%o*KB","x":65,"y":169,"fields":{"NAME":"Мигнуть"},"inputs":{"STACK":{"block":{"type":"mur_set_leds_all","id":"/F_f_Q/zgSxAx#v{,5:X","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":".XKpmgK[aKvl{2}^%YKd","fields":{"Colour":"#ffff00"}}}},"next":{"block":{"type":"mur_delay","id":"{x,69+WaF2yIF7A??xKy","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"oq{%pQrJpyc?(dY!lA*=","fields":{"Value":0.3}}}},"next":{"block":{"type":"mur_set_leds_all","id":"6-dw6rp.E_uU!|Qn.WGO","inputs":{"Colour":{"shadow":{"type":"mur_colour_picker","id":"IU0#B=kg[Bl:wEeRC[[2","fields":{"Colour":"#000000"}}}}}}}}}}}}]}}',
    ),
    version: 0,
  },

  {
    name: 'Тест: движения по осям (1)',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"!u}0:S9B,!kQkgmlHiSg","x":-39,"y":118,"fields":{"NAME":"вперёд"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":":T/A{BR|OXHGI~xjg({o","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"n[v#rc*9I[`PesKj!~}t","fields":{"Value":50}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"v9~TeZEhT~,tB?7~P68{","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"c?MC?Z%LHj.50-QN@g+%","next":{"block":{"type":"mur_delay","id":"7.ij$lWr{9+6er3B2x8,","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"l^H@n$tB=n#UJhq4jD^|","fields":{"Value":2}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"|+xf`x}6xmFYB~sa2a-w","x":-39,"y":403,"fields":{"NAME":"назад"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"uB8lUnN9?TJrSSv~*5=E","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"r`c.OLc|CS6H1*k~*fTa","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"P;Ej+g!C/J[Ymc%Pbz!q","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"(GL+o,UTHrZaD*P`i?!Z","next":{"block":{"type":"mur_delay","id":"AbvL%1~x,Xfqob4M8J$;","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"{p4+O(}~-/2pq~NbXGrz","fields":{"Value":2}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"6m-oFc*E%`du=rS(NK#J","x":169,"y":117,"fields":{"NAME":"вперёд с регулятором"},"inputs":{"STACK":{"block":{"type":"mur_set_yaw","id":"E^gj@B*anM3VnnjcGA^b","fields":{"MODE":"SET_YAW_ABSOLUTE"},"inputs":{"Angle":{"shadow":{"type":"mur_number_degrees","id":"#)-PErm+,L-Qn`kz8-Zv","fields":{"Value":0}}},"Power":{"shadow":{"type":"mur_number_slider_positive","id":",!*QLMJ!K0BRIow{=q7N","fields":{"Value":75}}}},"next":{"block":{"type":"mur_set_axis","id":"@D[nF64EiG_0sk68U8WB","fields":{"MODE":"AXIS_MARCH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"%;n+jb=w#~%1FDwEjwJ~","fields":{"Value":50}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"A;[o)vY$$XyA/WR+ANgY","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"k3hpD]!N2{m:B1L$j%x["}}}}}}}}}},{"type":"procedures_callnoreturn","id":"r1d2x*prqdpQ=j_L]%03","x":195,"y":430,"extraState":{"name":"вперёд"},"next":{"block":{"type":"procedures_callnoreturn","id":"79%7Z#UPzGEVw9nF4?Kq","extraState":{"name":"назад"},"next":{"block":{"type":"procedures_callnoreturn","id":"}WI4+jh3J-h*~nS6Slzj","extraState":{"name":"вперёд с регулятором"},"next":{"block":{"type":"mur_end_thread","id":"`.cXjCmWPl~=c/*kDxlf","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}]}}',
    ),
    version: 0,
  },

  {
    name: 'Тест: движения по осям (2)',
    data: JSON.parse(
        '{"blocks":{"languageVersion":0,"blocks":[{"type":"procedures_defnoreturn","id":"S^-{b+1[;_dLM~6:Z@Op","x":-143,"y":169,"fields":{"NAME":"всплывать с кручением по часовой"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"@-]X?arQ;KAp!+2y!DGm","fields":{"MODE":"AXIS_YAW"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"7l]cR5#C@VfQ_Q.|5+iu","fields":{"Value":50}}}},"next":{"block":{"type":"mur_set_axis","id":"2F=$Tzz/-+s_NWfLT^mU","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"u/Ff0SeMJQ#ZwGrRH).|","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"5!e2HC$XGmJf3U4/1,u*","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"@BA=_rID,#MiuVDzf0R8","fields":{"Value":3}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"j;_FOBdOpe+bBK+ec8CT","x":-143,"y":377,"fields":{"NAME":"погружаться с кручение против часовой до удара"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"XtXzZbwhJ[Vwj7M6u@(6","fields":{"MODE":"AXIS_YAW"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"B+cImevrk_zNfDHJGlyo","fields":{"Value":-50}}}},"next":{"block":{"type":"mur_set_axis","id":"J#6TcAXqR*qdFo@l~4[9","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"XaXj#x+puAnT+^j]?u8C","fields":{"Value":-100}}}},"next":{"block":{"type":"mur_wait_imu_tap","id":"uf!TT`,O}GKfJy/rlGsv","fields":{"MODE":"IMU_TAP_ONE"},"next":{"block":{"type":"mur_stop_motors","id":"|PpqLiwD4f0p6t$%f{mk","next":{"block":{"type":"mur_delay","id":"lFLO5$`^XtT_/^z0?6PF","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"`$~6IQej5_BJeU;E,Fpg","fields":{"Value":1}}}}}}}}}}}}}}}},{"type":"procedures_defnoreturn","id":"!J=F*D;?T{sXb!hvn8T2","x":-143,"y":689,"fields":{"NAME":"всплывать с быстрым кручением по часовой"},"inputs":{"STACK":{"block":{"type":"mur_set_axis","id":"|73mXg4cPeUUMa42BJtT","fields":{"MODE":"AXIS_YAW"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"Be4FjG:DGU,I-s*z7$ra","fields":{"Value":100}}}},"next":{"block":{"type":"mur_set_axis","id":"m#K^!Szt_1|;`i7b34Cq","fields":{"MODE":"AXIS_DEPTH"},"inputs":{"Power":{"shadow":{"type":"mur_number_slider","id":"G;Wzrnko8.6j9T$fe9IO","fields":{"Value":100}}}},"next":{"block":{"type":"mur_delay","id":"jJ5NJDcNONWg$j#L-kaE","inputs":{"sleepSeconds":{"shadow":{"type":"mur_number","id":"6teg;rSUbpH34Z40Wb-r","fields":{"Value":4}}}}}}}}}}}},{"type":"procedures_callnoreturn","id":"9nc#bI_RHQ9D,3ybVHs}","x":351,"y":169,"extraState":{"name":"всплывать с кручением по часовой"},"next":{"block":{"type":"procedures_callnoreturn","id":"dmRtz^y6|L]yF8%O(toT","extraState":{"name":"погружаться с кручение против часовой до удара"},"next":{"block":{"type":"procedures_callnoreturn","id":"!ljk]*DE;[QYh^.)c1K3","extraState":{"name":"всплывать с быстрым кручением по часовой"},"next":{"block":{"type":"mur_end_thread","id":"8YN-P6CjIL18A8fsh97G","fields":{"MODE":"MODE_END_SCRIPT"}}}}}}}}]}}',
    ),
    version: 0,
  },

  /*

  {
    name: 'Тест: ',
    data: JSON.parse(
        '',
    ),
    version: 0,
  },

  */

];

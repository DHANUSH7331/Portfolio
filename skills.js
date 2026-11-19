/* Skills: rotating orbit + connected side lists */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var touchOnly = window.matchMedia("(hover: none)").matches;
  var orbit = document.getElementById("sk-orbit");
  if (!orbit) return;

  /* ---------- icons (Simple Icons paths inlined, plus a few simple glyphs) ---------- */
  var ICONS = {"python":"M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z","django":"M11.146 0h3.924v18.166c-2.013.382-3.491.535-5.096.535-4.791 0-7.288-2.166-7.288-6.32 0-4.002 2.65-6.6 6.753-6.6.637 0 1.121.05 1.707.203zm0 9.143a3.894 3.894 0 00-1.325-.204c-1.988 0-3.134 1.223-3.134 3.365 0 2.09 1.096 3.236 3.109 3.236.433 0 .79-.025 1.35-.102V9.142zM21.314 6.06v9.098c0 3.134-.229 4.638-.917 5.937-.637 1.249-1.478 2.039-3.211 2.905l-3.644-1.733c1.733-.815 2.574-1.53 3.109-2.625.561-1.121.739-2.421.739-5.835V6.059h3.924zM17.39.021h3.924v4.026H17.39z","html5":"M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z","css3":"M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z","javascript":"M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z","mysql":"M16.405 5.501c-.115 0-.193.014-.274.033v.013h.014c.054.104.146.18.214.273.054.107.1.214.154.32l.014-.015c.094-.066.14-.172.14-.333-.04-.047-.046-.094-.08-.14-.04-.067-.126-.1-.18-.153zM5.77 18.695h-.927a50.854 50.854 0 00-.27-4.41h-.008l-1.41 4.41H2.45l-1.4-4.41h-.01a72.892 72.892 0 00-.195 4.41H0c.055-1.966.192-3.81.41-5.53h1.15l1.335 4.064h.008l1.347-4.064h1.095c.242 2.015.384 3.86.428 5.53zm4.017-4.08c-.378 2.045-.876 3.533-1.492 4.46-.482.716-1.01 1.073-1.583 1.073-.153 0-.34-.046-.566-.138v-.494c.11.017.24.026.386.026.268 0 .483-.075.647-.222.197-.18.295-.382.295-.605 0-.155-.077-.47-.23-.944L6.23 14.615h.91l.727 2.36c.164.536.233.91.205 1.123.4-1.064.678-2.227.835-3.483zm12.325 4.08h-2.63v-5.53h.885v4.85h1.745zm-3.32.135l-1.016-.5c.09-.076.177-.158.255-.25.433-.506.648-1.258.648-2.253 0-1.83-.718-2.746-2.155-2.746-.704 0-1.254.232-1.65.697-.43.508-.646 1.256-.646 2.245 0 .972.19 1.686.574 2.14.35.41.877.615 1.583.615.264 0 .506-.033.725-.098l1.325.772.36-.622zM15.5 17.588c-.225-.36-.337-.94-.337-1.736 0-1.393.424-2.09 1.27-2.09.443 0 .77.167.977.5.224.362.336.936.336 1.723 0 1.404-.424 2.108-1.27 2.108-.445 0-.77-.167-.978-.5zm-1.658-.425c0 .47-.172.856-.516 1.156-.344.3-.803.45-1.384.45-.543 0-1.064-.172-1.573-.515l.237-.476c.438.22.833.328 1.19.328.332 0 .593-.073.783-.22a.754.754 0 00.3-.615c0-.33-.23-.61-.648-.845-.388-.213-1.163-.657-1.163-.657-.422-.307-.632-.636-.632-1.177 0-.45.157-.81.47-1.085.315-.278.72-.415 1.22-.415.512 0 .98.136 1.4.41l-.213.476a2.726 2.726 0 00-1.064-.23c-.283 0-.502.068-.654.206a.685.685 0 00-.248.524c0 .328.234.61.666.85.393.215 1.187.67 1.187.67.433.305.648.63.648 1.168zm9.382-5.852c-.535-.014-.95.04-1.297.188-.1.04-.26.04-.274.167.055.053.063.14.11.214.08.134.218.313.346.407.14.11.28.216.427.31.26.16.555.255.81.416.145.094.293.213.44.313.073.05.12.14.214.172v-.02c-.046-.06-.06-.147-.105-.214-.067-.067-.134-.127-.2-.193a3.223 3.223 0 00-.695-.675c-.214-.146-.682-.35-.77-.595l-.013-.014c.146-.013.32-.066.46-.106.227-.06.435-.047.67-.106.106-.027.213-.06.32-.094v-.06c-.12-.12-.21-.283-.334-.395a8.867 8.867 0 00-1.104-.823c-.21-.134-.476-.22-.697-.334-.08-.04-.214-.06-.26-.127-.12-.146-.19-.34-.275-.514a17.69 17.69 0 01-.547-1.163c-.12-.262-.193-.523-.34-.763-.69-1.137-1.437-1.826-2.586-2.5-.247-.14-.543-.2-.856-.274-.167-.008-.334-.02-.5-.027-.11-.047-.216-.174-.31-.235-.38-.24-1.364-.76-1.644-.072-.18.434.267.862.422 1.082.115.153.26.328.34.5.047.116.06.235.107.356.106.294.207.622.347.897.073.14.153.287.247.413.054.073.146.107.167.227-.094.136-.1.334-.154.5-.24.757-.146 1.693.194 2.25.107.166.362.534.703.393.3-.12.234-.5.32-.835.02-.08.007-.133.048-.187v.015c.094.188.188.367.274.555.206.328.566.668.867.895.16.12.287.328.487.402v-.02h-.015c-.043-.058-.1-.086-.154-.133a3.445 3.445 0 01-.35-.4 8.76 8.76 0 01-.747-1.218c-.11-.21-.202-.436-.29-.643-.04-.08-.04-.2-.107-.24-.1.146-.247.273-.32.453-.127.288-.14.642-.188 1.01-.027.007-.014 0-.027.014-.214-.052-.287-.274-.367-.46-.2-.475-.233-1.238-.06-1.785.047-.14.247-.582.167-.716-.042-.127-.174-.2-.247-.303a2.478 2.478 0 01-.24-.427c-.16-.374-.24-.788-.414-1.162-.08-.173-.22-.354-.334-.513-.127-.18-.267-.307-.368-.52-.033-.073-.08-.194-.027-.274.014-.054.042-.075.094-.09.088-.072.335.022.422.062.247.1.455.194.662.334.094.066.195.193.315.226h.14c.214.047.455.014.655.073.355.114.675.28.962.46a5.953 5.953 0 012.085 2.286c.08.154.115.295.188.455.14.33.313.663.455.982.14.315.275.636.476.897.1.14.502.213.682.286.133.06.34.115.46.188.23.14.454.3.67.454.11.076.443.243.463.378z","powerbi":"M10 12a1 1 0 0 1 1 1v11H4a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h6Zm-2-.5V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17h-4.5V13a1.5 1.5 0 0 0-1.5-1.5H8Zm5-6V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1h-3.5V7A1.5 1.5 0 0 0 15 5.5h-2Z","pandas":"M16.922 0h2.623v18.104h-2.623zm-4.126 12.94h2.623v2.57h-2.623zm0-7.037h2.623v5.446h-2.623zm0 11.197h2.623v5.446h-2.623zM4.456 5.896h2.622V24H4.455zm4.213 2.559h2.623v2.57H8.67zm0 4.151h2.623v5.447H8.67zm0-11.187h2.623v5.446H8.67Z","numpy":"M10.315 4.876L6.3048 2.8517l-4.401 2.1965 4.1186 2.0683zm1.8381.9277l4.2045 2.1223-4.3622 2.1906-4.125-2.0718zm5.6153-2.9213l4.3193 2.1658-3.863 1.9402-4.2131-2.1252zm-1.859-.9329L12.021 0 8.1742 1.9193l4.0068 2.0208zm-3.0401 16.7443V24l4.7107-2.3507-.0053-5.3085zm4.7037-4.2057l-.0052-5.2528-4.6985 2.3356v5.2546zm5.6553-.9845v5.327l-4.0178 2.0052-.0029-5.3028zm0-1.8626V6.4214l-4.0253 2.001.0034 5.2633zM11.2062 11.571L8.0333 9.9756v6.895s-3.8804-8.2564-4.2399-8.998c-.0463-.0957-.2371-.2007-.2858-.2262C2.8118 7.2812.773 6.2485.773 6.2485V18.43l2.8204 1.5076v-6.3674s3.8392 7.3775 3.878 7.458c.0389.0807.4245.8582.8362 1.1314.5485.363 2.8992 1.7766 2.8992 1.7766z","scikitlearn":"M15.601 5.53c-1.91.035-3.981.91-5.63 2.56-2.93 2.93-2.083 8.53-1.088 9.525.805.804 6.595 1.843 9.526-1.088a9.74 9.74 0 0 0 .584-.643c.043-.292.205-.66.489-1.106a1.848 1.848 0 0 1-.537.176c-.144.265-.37.55-.676.855-.354.335-.607.554-.76.656a.795.795 0 0 1-.437.152c-.35 0-.514-.308-.494-.924-.22.316-.425.549-.612.7a.914.914 0 0 1-.578.224c-.194 0-.36-.09-.496-.273a1.03 1.03 0 0 1-.193-.507 4.016 4.016 0 0 1-.726.583c-.224.132-.47.197-.74.197-.3 0-.543-.096-.727-.288a.978.978 0 0 1-.257-.524v.004c-.3.276-.564.48-.79.611a1.295 1.295 0 0 1-.649.197.693.693 0 0 1-.571-.275c-.145-.183-.218-.43-.218-.739 0-.464.101-1.02.302-1.67.201-.65.445-1.25.733-1.797l.842-.312a.21.21 0 0 1 .06-.013c.063 0 .116.047.157.14.04.095.061.221.061.38 0 .451-.104.888-.312 1.31-.207.422-.532.873-.974 1.352-.018.23-.027.388-.027.474 0 .193.036.345.106.458.071.113.165.169.282.169a.71.71 0 0 0 .382-.13c.132-.084.333-.26.602-.523.028-.418.187-.798.482-1.142.324-.38.685-.569 1.08-.569.206 0 .37.054.494.16a.524.524 0 0 1 .186.417c0 .458-.486.829-1.459 1.114.088.43.32.646.693.646a.807.807 0 0 0 .417-.117c.129-.076.321-.243.575-.497.032-.252.118-.495.259-.728.182-.3.416-.544.701-.73.285-.185.537-.278.756-.278.276 0 .47.127.58.381l.677-.374h.186l-.292.971c-.15.488-.226.823-.226 1.004 0 .19.067.285.202.285.086 0 .181-.045.285-.137.104-.092.25-.232.437-.42v.001c.143-.155.274-.32.392-.494-.19-.084-.285-.21-.285-.375 0-.17.058-.352.174-.545.116-.194.275-.29.479-.29.172 0 .258.088.258.265 0 .139-.05.338-.149.596.367-.04.687-.32.961-.842l.228-.01c1.059-2.438.828-5.075-.83-6.732-1.019-1.02-2.408-1.5-3.895-1.471zm4.725 8.203a8.938 8.938 0 0 1-1.333 2.151 1.09 1.09 0 0 0-.012.147c0 .168.047.309.14.423.092.113.206.17.34.17.296 0 .714-.264 1.254-.787-.001.04-.003.08-.003.121 0 .146.012.368.036.666l.733-.172c0-.2.003-.357.01-.474.01-.157.033-.33.066-.517.02-.11.07-.216.152-.315l.186-.216a5.276 5.276 0 0 1 .378-.397c.062-.055.116-.099.162-.13a.26.26 0 0 1 .123-.046c.055 0 .083.035.083.106 0 .07-.052.236-.156.497-.194.486-.292.848-.292 1.084 0 .175.046.314.136.418a.45.45 0 0 0 .358.155c.365 0 .803-.269 1.313-.808v-.381c-.361.426-.623.64-.784.64-.109 0-.163-.067-.163-.2 0-.1.065-.316.195-.65.19-.486.285-.836.285-1.048a.464.464 0 0 0-.112-.319.36.36 0 0 0-.282-.127c-.165 0-.354.077-.567.233-.213.156-.5.436-.863.84.053-.262.165-.622.335-1.08l-.809.156a6.54 6.54 0 0 0-.399 1.074c-.04.156-.07.316-.092.48a7.447 7.447 0 0 1-.49.45.38.38 0 0 1-.229.08.208.208 0 0 1-.174-.082.352.352 0 0 1-.064-.222c0-.1.019-.214.056-.343.038-.13.12-.373.249-.731l.308-.849zm-17.21-2.927c-.863-.016-1.67.263-2.261.854-1.352 1.352-1.07 3.827.631 5.527 1.7 1.701 4.95 1.21 5.527.632.467-.466 1.07-3.827-.631-5.527-.957-.957-2.158-1.465-3.267-1.486zm12.285.358h.166v.21H15.4zm.427 0h.166v.865l.46-.455h.195l-.364.362.428.684h-.198l-.357-.575-.164.166v.41h-.166zm1.016 0h.166v.21h-.166zm.481.122h.166v.288h.172v.135h-.172v.717c0 .037.006.062.02.075.012.013.037.02.074.02a.23.23 0 0 0 .078-.01v.141a.802.802 0 0 1-.136.014.23.23 0 0 1-.15-.043.15.15 0 0 1-.052-.123v-.79h-.141v-.136h.141zm-3.562.258c.081 0 .15.012.207.038.057.024.1.061.13.11s.045.106.045.173h-.176c-.006-.111-.075-.167-.208-.167a.285.285 0 0 0-.164.041.134.134 0 0 0-.06.117c0 .035.015.065.045.088.03.024.08.044.15.06l.16.039a.47.47 0 0 1 .224.105c.047.046.07.108.07.186a.3.3 0 0 1-.052.175.327.327 0 0 1-.152.116.585.585 0 0 1-.226.041c-.136 0-.24-.03-.309-.088-.069-.059-.105-.149-.109-.269h.176c.004.037.01.065.017.084a.166.166 0 0 0 .034.054c.044.043.112.065.204.065a.31.31 0 0 0 .177-.045.139.139 0 0 0 .067-.119.116.116 0 0 0-.038-.09.287.287 0 0 0-.124-.055l-.156-.038a1.248 1.248 0 0 1-.159-.05.359.359 0 0 1-.098-.061.22.22 0 0 1-.058-.083.32.32 0 0 1-.016-.108c0-.096.036-.174.109-.232a.45.45 0 0 1 .29-.087zm1.035 0a.46.46 0 0 1 .202.043.351.351 0 0 1 .187.212.577.577 0 0 1 .023.126h-.168a.256.256 0 0 0-.078-.168.242.242 0 0 0-.17-.06.248.248 0 0 0-.155.05.306.306 0 0 0-.1.144.662.662 0 0 0-.034.224.58.58 0 0 0 .035.214.299.299 0 0 0 .101.135.261.261 0 0 0 .157.048c.142 0 .227-.084.256-.252h.167a.519.519 0 0 1-.065.22.35.35 0 0 1-.146.138.464.464 0 0 1-.216.048.448.448 0 0 1-.246-.066.441.441 0 0 1-.161-.192.703.703 0 0 1-.057-.293c0-.085.01-.163.032-.233a.522.522 0 0 1 .095-.182.403.403 0 0 1 .15-.117.453.453 0 0 1 .191-.04zm.603.03h.166v1.046H15.4zm1.443 0h.166v1.046h-.166zm-5.05.618c-.08 0-.2.204-.356.611-.155.407-.308.977-.459 1.71.281-.312.509-.662.683-1.05.175-.387.262-.72.262-.999a.455.455 0 0 0-.036-.197c-.025-.05-.056-.075-.093-.075zm4.662 1.797c-.221 0-.431.188-.629.563-.197.376-.296.722-.296 1.038 0 .12.029.216.088.29a.273.273 0 0 0 .223.111c.221 0 .43-.188.625-.565.196-.377.294-.725.294-1.043a.457.457 0 0 0-.083-.29.269.269 0 0 0-.222-.104zm-2.848.007c-.146 0-.285.11-.417.333-.133.222-.2.51-.2.866.566-.159.849-.452.849-.881 0-.212-.077-.318-.232-.318Z","git":"M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187","github":"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12","tableau":"M11.654.174V2.377H9.682v.58h1.972V5.16h.696V2.957h1.97v-.58h-1.97V.174h-.348zm6.03 2.262l-.002 1.623v1.623h-2.957v.927h2.957v3.188H18.725l.011-1.582.02-1.576 1.465-.02 1.46-.01v-.927H18.728V2.436h-.522zm-12.407.06V5.686H2.291v.925H5.277V9.801h.985V6.61h3.013v-.925H6.262V2.496H5.77zm6.086 5.27v3.593H8.06v1.188h3.304v3.596h1.28v-3.596H15.953v-1.188H12.643V7.766h-.637zm9.721 1.55v2.221h-2.012v.811h2.012v2.261h.887v-2.261H24v-.811h-2.029V9.317h-.422zm-19.111.131V11.621H0v.621H1.973v2.194H2.64v-2.194h2v-.62H2.609V9.446h-.318zm15.709 4.516v3.254h-3.016v.927h3.016v3.217h1.072v-3.216H21.74v-.928H18.754v-3.254h-.533zm-12.463.008v3.246H2.262v.928h2.957v3.189H6.32v-3.189h2.955v-.928H6.32V13.97h-.55zm6.316 4.578l.002 1.103v1.1H9.566v.812h1.971v2.262h.928l.012-1.119.017-1.143H14.463v-.812h-2V18.549h-.465z","visualstudiocode":"M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"};
  var GLYPH = {
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    db: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    api: '<path d="M7 7h4v4H7zM13 13h4v4h-4zM11 9h2a2 2 0 012 2v2"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l3 3"/>',
    resp: '<rect x="3" y="5" width="14" height="10" rx="1.5"/><rect x="14" y="9" width="7" height="11" rx="1.5"/>'
  };
  function icon(key) {
    if (ICONS[key]) return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + ICONS[key] + '"/></svg>';
    if (GLYPH[key]) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + GLYPH[key] + '</svg>';
    return "";
  }

  /* ---------- data ---------- */
  var SKILLS = [
    { name: "Python", icon: "python", level: "Backend \u00b7 88%", text: "Backend logic, automation and data work, used across my Django, machine learning and analytics projects." },
    { name: "Django", icon: "django", level: "Backend \u00b7 88%", text: "Built a bank management system with OTP email verification, sessions, file uploads and reCAPTCHA." },
    { name: "HTML5", icon: "html5", level: "Frontend \u00b7 80%", text: "Semantic, responsive page structure for dashboards and web apps like Vesper." },
    { name: "CSS3", icon: "css3", level: "Frontend \u00b7 80%", text: "Responsive layouts, mobile navigation drawers and reduced-motion support." },
    { name: "JavaScript", icon: "javascript", level: "Frontend \u00b7 80%", text: "Fetch API calls, LocalStorage persistence and Canvas charts in my frontend projects." },
    { name: "SQL", icon: "db", level: "Databases \u00b7 78%", text: "Querying and preparing data for the loan approval model and the smart grid dashboard." },
    { name: "Power BI", icon: "powerbi", level: "Visualization \u00b7 85%", text: "KPI-driven dashboards, like one monitoring energy use across 10+ urban zones." },
    { name: "Pandas", icon: "pandas", level: "Data Analysis \u00b7 83%", text: "Cleaning, transforming and analysing data with Pandas and NumPy." },
    { name: "Scikit-Learn", icon: "scikitlearn", level: "Machine Learning \u00b7 76%", text: "Classification models, such as a loan approval predictor reaching about 85% accuracy." },
    { name: "Git", icon: "git", level: "Tools \u00b7 90%", text: "Version control and publishing every project to GitHub." }
  ];
  var LISTS = {
    dev: { title: "Development", startDelay: 0, items: [
      ["Python", "python"], ["Django", "django"], ["REST APIs", "api"], ["Django ORM", "db"], ["JWT / Sessions", "key"],
      ["HTML5", "html5"], ["CSS3", "css3"], ["JavaScript", "javascript"], ["Fetch API", "code"], ["Responsive Design", "resp"]
    ] },
    data: { title: "Data, AI & Tools", startDelay: 0.5, items: [
      ["SQL", "db"], ["MySQL", "mysql"], ["Pandas", "pandas"], ["NumPy", "numpy"], ["Power BI", "powerbi"],
      ["DAX", "code"], ["Tableau", "tableau"], ["Scikit-Learn", "scikitlearn"], ["Git / GitHub", "github"], ["VS Code", "visualstudiocode"]
    ] }
  };
  GLYPH.code = '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>';

  var hint = document.getElementById("sk-hint-text");
  if (hint) hint.textContent = touchOnly ? "Tap a skill to explore" : "Hover a skill to explore";

  /* ---------- orbit ---------- */
  var BASE = 560, PERIOD = 22;
  var rot = document.createElement("div"); rot.className = "sk-rot";
  var ringSolid = document.createElement("div"); ringSolid.className = "sk-ring sk-ring-solid";
  var ringDash = document.createElement("div"); ringDash.className = "sk-ring sk-ring-dash";
  var core = document.createElement("div"); core.className = "sk-core"; core.innerHTML = "<span>Skills</span>";
  var card = document.createElement("div"); card.className = "sk-card"; card.setAttribute("aria-live", "polite");
  orbit.classList.add("pre");
  orbit.appendChild(ringSolid); orbit.appendChild(ringDash); orbit.appendChild(rot); orbit.appendChild(core); orbit.appendChild(card);

  var nodes = [], inners = [], active = null, lastPointer = "mouse";
  SKILLS.forEach(function (s, i) {
    var item = document.createElement("div"); item.className = "sk-item"; item.style.setProperty("--i", i);
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "sk-btn"; btn.setAttribute("aria-label", s.name);
    var inner = document.createElement("div"); inner.className = "sk-inner";
    var circle = document.createElement("div"); circle.className = "sk-circle"; circle.innerHTML = icon(s.icon);
    inner.appendChild(circle); btn.appendChild(inner); item.appendChild(btn); rot.appendChild(item);
    nodes.push({ item: item, btn: btn, circle: circle, s: s }); inners.push(inner);

    btn.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType; });
    btn.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") show(i); });
    btn.addEventListener("pointerleave", function (e) { if (e.pointerType === "mouse") hide(); });
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (lastPointer === "mouse") return;
      if (active === i) hide(); else show(i);
    });
    btn.addEventListener("focus", function () { if (btn.matches(":focus-visible")) show(i); });
    btn.addEventListener("blur", hide);
  });
  document.getElementById("skills").addEventListener("click", function () { if (active !== null) hide(); });

  function layout() {
    var y = Math.max(280, Math.min(BASE, window.innerWidth - 24, window.innerHeight - 230));
    var z = y / BASE;
    var D = 210 * z, O = Math.max(54, 76 * z), j = O - 6, C = Math.max(22, 28 * z);
    var N = Math.max(86, 118 * z), U = Math.max(20, 36 * z), q = Math.max(170, 230 * z);
    orbit.style.width = y + "px"; orbit.style.height = y + "px";
    ringSolid.style.width = ringSolid.style.height = D * 2 + "px";
    ringDash.style.width = ringDash.style.height = 270 * z + "px";
    core.style.width = core.style.height = N + "px"; core.firstChild.style.fontSize = U + "px";
    card.style.width = q + "px";
    nodes.forEach(function (n, i) {
      var a = i / nodes.length * Math.PI * 2;
      n.item.style.width = n.item.style.height = O + "px";
      n.item.style.left = "calc(50% + " + (Math.cos(a) * D - O / 2) + "px)";
      n.item.style.top = "calc(50% + " + (Math.sin(a) * D - O / 2) + "px)";
      n.circle.style.width = n.circle.style.height = j + "px";
      var svg = n.circle.firstChild; if (svg) { svg.style.width = svg.style.height = C + "px"; }
    });
  }
  layout();
  window.addEventListener("resize", layout);

  /* rotation driver with eased pause (like a time-scale change) */
  var angle = 0, speed = 1, target = 1, last = performance.now(), visible = false, rafId = 0;
  function frame(now) {
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    speed += (target - speed) * Math.min(1, dt / 0.16);
    angle = (angle + 360 / PERIOD * dt * speed) % 360;
    rot.style.transform = "rotate(" + angle + "deg)";
    for (var k = 0; k < inners.length; k++) inners[k].style.transform = "rotate(" + (-angle) + "deg)";
    rafId = visible ? requestAnimationFrame(frame) : 0;
  }
  function setVisible(v) {
    visible = v;
    if (v && !rafId && !reduce) { last = performance.now(); rafId = requestAnimationFrame(frame); }
  }

  function show(i) {
    clearActive();
    active = i; target = 0;
    var n = nodes[i];
    n.btn.classList.add("active");
    card.innerHTML = '<div class="sk-card-in"><h3>' + n.s.name + '</h3><p class="sk-level">' + n.s.level + '</p><span class="sk-sep"></span><p class="sk-text">' + n.s.text + "</p></div>";
    card.classList.add("show");
  }
  function clearActive() { nodes.forEach(function (n) { n.btn.classList.remove("active"); }); }
  function hide() {
    active = null; target = 1;
    clearActive();
    card.classList.remove("show");
  }

  /* intro when scrolled into view */
  if ("IntersectionObserver" in window && !reduce) {
    var introIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { orbit.classList.remove("pre"); introIO.disconnect(); } });
    }, { rootMargin: "0px 0px -35% 0px" });
    introIO.observe(orbit);
    new IntersectionObserver(function (es) { setVisible(es[0].isIntersecting); }, { rootMargin: "120px" }).observe(orbit);
  } else {
    orbit.classList.remove("pre");
  }

  /* ---------- side lists with connector lines ---------- */
  var PULSE = 64, HEAD = 14, SPEED = 240, MIN_CYCLE = 3.4;
  function buildList(el, def) {
    el.innerHTML = "";
    var head = document.createElement("div"); head.className = "sk-lhead";
    var dia = document.createElement("span"); dia.className = "sk-diamond"; dia.setAttribute("aria-hidden", "true");
    var h3 = document.createElement("h3"); h3.textContent = def.title;
    head.appendChild(dia); head.appendChild(h3);
    var ul = document.createElement("ul"); ul.className = "sk-ul"; ul.setAttribute("aria-label", def.title + " skills");
    var rows = [], glows = [], icos = [];
    def.items.forEach(function (it, i) {
      var li = document.createElement("li");
      var row = document.createElement("div"); row.className = "sk-row"; row.style.setProperty("--i", i);
      var glow = document.createElement("span"); glow.className = "sk-glow"; glow.setAttribute("aria-hidden", "true");
      var ico = document.createElement("span"); ico.className = "sk-ico"; ico.setAttribute("aria-hidden", "true"); ico.innerHTML = icon(it[1]);
      var name = document.createElement("span"); name.className = "sk-name"; name.textContent = it[0];
      row.appendChild(glow); row.appendChild(ico); row.appendChild(name); li.appendChild(row); ul.appendChild(li);
      rows.push(row); glows.push(glow); icos.push(ico);
    });
    el.appendChild(head); el.appendChild(ul);

    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg"); svg.setAttribute("class", "sk-wires"); svg.setAttribute("aria-hidden", "true");
    el.insertBefore(svg, el.firstChild);
    var anims = [];

    function compute() {
      anims.forEach(function (a) { a.cancel(); }); anims = [];
      svg.innerHTML = "";
      var W = el.offsetWidth, H = el.offsetHeight;
      svg.setAttribute("width", W); svg.setAttribute("height", H);
      var N = dia.offsetLeft + dia.offsetWidth / 2, U = dia.offsetTop + dia.offsetHeight;
      var geo = rows.map(function (r) {
        var cy = r.offsetTop + r.offsetHeight / 2, left = r.offsetLeft;
        var toRight = left + r.offsetWidth / 2 > N;
        var x1 = toRight ? left : left + r.offsetWidth;
        var dir = toRight ? 1 : -1;
        var rad = Math.max(2, Math.min(14, Math.abs(x1 - N), cy - U));
        return { cy: cy, x1: x1, dir: dir, r: rad };
      });
      var lastG = geo[geo.length - 1];
      var base = document.createElementNS(svgNS, "g");
      base.setAttribute("fill", "none"); base.setAttribute("stroke", "rgba(255,150,60,0.34)"); base.setAttribute("stroke-width", "1.5");
      var trunk = document.createElementNS(svgNS, "path"); trunk.setAttribute("d", "M" + N + " " + U + " V" + (lastG.cy - lastG.r)); base.appendChild(trunk);
      geo.forEach(function (g) {
        var p = document.createElementNS(svgNS, "path");
        p.setAttribute("d", "M" + N + " " + (g.cy - g.r) + " Q" + N + " " + g.cy + " " + (N + g.dir * g.r) + " " + g.cy + " H" + g.x1);
        base.appendChild(p);
      });
      svg.appendChild(base);
      if (reduce) return;

      var g2 = document.createElementNS(svgNS, "g"); g2.setAttribute("fill", "none"); g2.setAttribute("stroke-linecap", "round");
      svg.appendChild(g2);
      geo.forEach(function (g, i) {
        var d = "M" + N + " " + U + " V" + (g.cy - g.r) + " Q" + N + " " + g.cy + " " + (N + g.dir * g.r) + " " + g.cy + " H" + g.x1;
        var trail = document.createElementNS(svgNS, "path"), headP = document.createElementNS(svgNS, "path");
        trail.setAttribute("d", d); trail.setAttribute("stroke", "rgba(255,150,60,0.45)"); trail.setAttribute("stroke-width", "2");
        headP.setAttribute("d", d); headP.setAttribute("stroke", "#fff2e0"); headP.setAttribute("stroke-width", "2.4");
        g2.appendChild(trail); g2.appendChild(headP);
        var len = trail.getTotalLength(), gap = len + PULSE + 10;
        trail.style.strokeDasharray = PULSE + " " + gap; headP.style.strokeDasharray = HEAD + " " + gap;
        var travel = (len + PULSE) / SPEED, arrive = len / SPEED;
        var cycle = Math.max(MIN_CYCLE, travel + 0.3), cms = cycle * 1000, f = travel / cycle;
        var delay = (1.2 + def.startDelay) * 1000;
        var o1 = { duration: cms, iterations: Infinity, delay: delay, easing: "linear" };
        anims.push(trail.animate([{ strokeDashoffset: PULSE + "px", offset: 0 }, { strokeDashoffset: (-len) + "px", offset: f }, { strokeDashoffset: (-len) + "px", offset: 1 }], o1));
        anims.push(headP.animate([{ strokeDashoffset: HEAD + "px", offset: 0 }, { strokeDashoffset: (HEAD - PULSE - len) + "px", offset: f }, { strokeDashoffset: (HEAD - PULSE - len) + "px", offset: 1 }], o1));
        var a0 = Math.max(0, arrive - 0.08) / cycle, a1 = Math.min(0.97, a0 + 0.15 / cycle), a2 = Math.min(0.99, a0 + 1.05 / cycle);
        var dim = "rgba(246,237,225,.8)";
        anims.push(glows[i].animate([{ opacity: 0, offset: 0 }, { opacity: 0, offset: a0 }, { opacity: 1, offset: a1 }, { opacity: 0, offset: a2 }, { opacity: 0, offset: 1 }], o1));
        anims.push(icos[i].animate([{ color: dim, offset: 0 }, { color: dim, offset: a0 }, { color: "#ff7a1a", offset: a1 }, { color: dim, offset: a2 }, { color: dim, offset: 1 }], o1));
      });
      anims.forEach(function (a) { if (el._inView) a.play(); else a.pause(); });
    }

    var raf = 0;
    function schedule() { if (raf) return; raf = requestAnimationFrame(function () { raf = 0; compute(); }); }
    if ("ResizeObserver" in window) new ResizeObserver(schedule).observe(el); else window.addEventListener("resize", schedule);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
    schedule();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          el._inView = e.isIntersecting;
          anims.forEach(function (a) { if (e.isIntersecting) a.play(); else a.pause(); });
        });
      }, { rootMargin: "80px" }).observe(el);
      new IntersectionObserver(function (es, o) {
        es.forEach(function (e) { if (e.isIntersecting) { el.classList.add("in"); o.disconnect(); } });
      }, { rootMargin: "0px 0px -18% 0px" }).observe(el);
    } else { el.classList.add("in"); }
    if (reduce) el.classList.add("in");
  }

  document.querySelectorAll("[data-list]").forEach(function (el) {
    var def = LISTS[el.getAttribute("data-list")];
    if (def) buildList(el, def);
  });
})();

//
// mod_Shopbot.js
//   fab modules Shopbot output
//
// Neil Gershenfeld 
// (c) Massachusetts Institute of Technology 2014
// 
// This work may be reproduced, modified, distributed, performed, and 
// displayed for any purpose, but must acknowledge the fab modules 
// project. Copyright is retained and must be preserved. The work is 
// provided as is; no warranty is provided, and users accept all 
// liability.
//

var label = document.getElementById("mod_inputs_label")
var input = label.innerHTML
if (input == "path (.svg)") {
   //
   // vector input processes
   //
   }
else {
   //
   // raster input processes
   //
   mod_add_process([
      ["name","7/16 plywood (1/8 mill)"],
      ["module","Shopbot"],
      ["controls","mod_path_image_22D_controls"],
      ["routine","mod_Shopbot_path"],
      ["command","gedit"],
      ["depth","3.175"],
      ["thickness","11.11"],
      ["diameter","3.175"],
      ["cut_speed","50"],
      ["plunge_speed","25"],
      ["spindle_speed","10000"],
      ["offsets","1"],
      ["overlap","0"],
      ["error","1.5"],
      ["merge","1.5"],
      ])
   mod_add_process([
      ["name","1/2 HDPE (1/8 mill)"],
      ["module","Shopbot"],
      ["controls","mod_path_image_22D_controls"],
      ["routine","mod_Shopbot_path"],
      ["command","gedit"],
      ["depth","3.175"],
      ["thickness","12.7"],
      ["diameter","3.175"],
      ["cut_speed","10"],
      ["plunge_speed","5"],
      ["spindle_speed","10000"],
      ["offsets","1"],
      ["overlap","0"],
      ["error","1.5"],
      ["merge","1.5"],
      ])   
   mod_add_process([
      ["name","foam rough cut (1/8)"],
      ["module","Shopbot"],
      ["controls","mod_path_image_25D_controls"],
      ["routine","mod_Shopbot_path"],
      ["command","gedit"],
      ["cut_speed","50"],
      ["plunge_speed","25"],
      ["spindle_speed","10000"],
      ["depth","3.175"],
      ["diameter","3.175"],
      ["overlap","50"],
      ["offsets","-1"],
      ["error","1.5"],
      ["merge","1.5"],
      ])   
   mod_add_process([
      ["name","foam finish cut (1/8)"],
      ["module","Shopbot"],
      ["controls","mod_path_image_3D_controls"],
      ["routine","mod_Shopbot_path"],
      ["command","gedit"],
      ["cut_speed","50"],
      ["plunge_speed","25"],
      ["spindle_speed","10000"],
      ["diameter","3.175"],
      ["length","25.4"],
      ["overlap","50"],
      ["error","1.5"],
      ])
   }
//
// mod_load_handler
//   file load handler
//
function mod_load_handler() {
   document.mod.output = "Shopbot"
   mod_ui_prompt("process?")
   var controls = document.getElementById("mod_output_controls")
   controls.innerHTML = "<br><b>output</b>"
   controls.innerHTML += "<br>cut speed (mm/s):"
   controls.innerHTML += "&nbsp;<input type='text' id='mod_cut_speed' size='3' value='20'>"
   controls.innerHTML += "<br>plunge speed (mm/s):"
   controls.innerHTML += "&nbsp;<input type='text' id='mod_plunge_speed' size='3' value='20'>"
   controls.innerHTML += "<br>jog speed (mm/s):"
   controls.innerHTML += "&nbsp;<input type='text' id='mod_jog_speed' size='3' value='75'>"
   controls.innerHTML += "<br>jog height (mm):"
   controls.innerHTML += "&nbsp;<input type='text' id='mod_jog_height' size='3' value='5'>"
   controls.innerHTML += "<br>spindle speed (RPM):"
   controls.innerHTML += "&nbsp;<input type='text' id='mod_spindle_speed' size='3' value='10000'>"
   controls.innerHTML += "<br>file units: in <input type='radio' name='mod_units' id='mod_inches' checked> mm <input type='radio' name='mod_units' id='mod_mm'>"
   var label = document.getElementById("mod_processes_label")
   label.innerHTML ="process"
   label.style.display = "block"
   label.onclick = function (e) {
      mod_ui_clear()
      mod_ui_show_input()
      mod_ui_menu_process()
      }
   label.onmouseover = function (e) {
      this.style.background = highlight_background_color
      }
   label.onmouseout = function (e) {
      this.style.background = background_color
      }
   }
//
// mod_Shopbot_path
//    convert path to Shopbot
//
function mod_Shopbot_path(path) {
   document.mod.type = ".sbp"
   if (document.getElementById("mod_inches").checked)
      var units = 1
   else
      var units = 25.4
   var dx = units*document.mod.width/document.mod.dpi
   var nx = document.mod.width
   var cut_speed = units*parseFloat(document.getElementById("mod_cut_speed").value)/25.4
   var plunge_speed = units*parseFloat(document.getElementById("mod_plunge_speed").value)/25.4
   var jog_speed = units*parseFloat(document.getElementById("mod_jog_speed").value)/25.4
   var jog_height = units*parseFloat(document.getElementById("mod_jog_height").value)/25.4
   var spindle_speed = parseFloat(document.getElementById("mod_spindle_speed").value)
   var scale = dx/(nx-1)
   var xoffset = 0
   var yoffset = 0
   var zoffset = 0
   str = "SA\r\n" // set to absolute distances
   str += "TR,"+spindle_speed+",1\r\n" // set spindle speed
   str += "SO,1,1\r\n" // set output number 1 to on
   str += "pause,2\r\n" // let spindle come up to speed
   str += "MS,"+cut_speed.toFixed(4)+","+plunge_speed.toFixed(4)+"\r\n" // set xy,z speed
   str += "JS,"+jog_speed.toFixed(4)+","+jog_speed.toFixed(4)+"\r\n" // set jog xy,z speed
   str += "JZ,"+jog_height.toFixed(4)+"\r\n" // move up
   //
   // follow segments
   //
   for (var seg = 0; seg < path.length; ++seg) {
      //
      // move up to starting point
      //
      x = xoffset + scale * path[seg][0][0]
      y = yoffset + scale * path[seg][0][1]
      str += "MZ,"+jog_height.toFixed(4)+"\r\n"
      str += "J2,"+x.toFixed(4)+","+y.toFixed(4)+"\r\n"
      //
      // move down
      //
      z = zoffset + scale * path[seg][0][2]
      str += "MZ,"+z.toFixed(4)+"\r\n"
      for (var pt = 1; pt < path[seg].length; ++pt) {
         //
         // move to next point
         //
         x = xoffset + scale * path[seg][pt][0]
         y = yoffset + scale * path[seg][pt][1]
         z = zoffset + scale * path[seg][pt][2]
         str += "M3,"+x.toFixed(4)+","+y.toFixed(4)+","+z.toFixed(4)+"\r\n"
         }
      }
   //
   // return
   //
   str += "MZ,"+jog_height.toFixed(4)+"\r\n"
   return str
   }


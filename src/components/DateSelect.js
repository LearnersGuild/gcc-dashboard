import React, { Component } from 'react';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import axios from 'axios';

class DateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    axios.get('/api/reports').then(function(response) {
      let wb = { SheetNames: [], Sheets: {}};
      let ws_name = 'SheetJS';
      let ws = XLSX.utils.aoa_to_sheet(response.data);
      wb.SheetNames.push(ws_name);
      wb.Sheets[ws_name] = ws;
      let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
      let wbout = XLSX.write(wb, wopts);
      const s2ab = (s) => {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
        return buf;
      };
      FileSaver.saveAs(new Blob([s2ab(wbout)], {type: 'application/octet-stream'}), 'test.xlsx');

    }).catch(function(error) {
      console.log(error.message);
    });
  }

  render() {
    return (
      <div>
        Date Select what the crap is going on
        <button onClick={this.handleSubmit}>Click me</button>
      </div>
    );
  }
}

export default DateSelect;

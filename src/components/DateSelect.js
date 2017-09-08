import React, { Component } from 'react';
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import axios from 'axios';
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker';
import Button from 'react-toolbox/lib/button/Button';
import Card from 'react-toolbox/lib/card/Card';
import CardText from 'react-toolbox/lib/card/CardText';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import cardStyle from './cardStyle';
import moment from 'moment-timezone';


class DateSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reportDate: '',
      reportStart: '',
      reportEnd: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.s2ab = this.s2ab.bind(this);
  }

  s2ab(s) {
    let buf = new ArrayBuffer(s.length);
    let view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }

  handleSubmit(e) {
    if (this.state.reportDate === '') {
      alert('Please select a date for the report');
    } else {
      axios.get('/api/reports').then(response => {
        let wb = { SheetNames: [], Sheets: {}};
        let ws_name = 'SheetJS';
        let ws = XLSX.utils.aoa_to_sheet(response.data);
        wb.SheetNames.push(ws_name);
        wb.Sheets[ws_name] = ws;
        let wopts = { bookType: 'xlsx', bookSST: false, type: 'binary' };
        let wbout = XLSX.write(wb, wopts);
        FileSaver.saveAs(new Blob([this.s2ab(wbout)], {type: 'application/octet-stream'}), 'test.xlsx');

      }).catch(error => {
        console.log(error.message);
      });
    }
  }

  handleChange(date) {
    this.setState({
      reportDate: moment.utc(date).toDate(),
      reportStart: moment.utc(date).subtract(1, 'days').format('YYYY-MM-DD'),
      reportEnd: moment.utc(date).add(1, 'days').format('YYYY-MM-DD')
    });
  }

  render() {
    return (
      <Card style={cardStyle()}>
        <CardTitle title="Select Report Date"/>
        <CardText>
          <DatePicker
            icon="event"
            label="Report Date"
            onChange={this.handleChange}
            maxDate={moment().subtract(1, 'days').toDate()}
            value={this.state.reportDate}
          />
          <Button
            label='Download Report'
            style={{
              backgroundColor: '#97C93D',
              color: 'white',
              marginTop: '2em',
              marginLeft: '1em'
            }}
            raised={true}
            onMouseUp={this.handleSubmit}
          />
        </CardText>
      </Card>
    );
  }
}

export default DateSelect;

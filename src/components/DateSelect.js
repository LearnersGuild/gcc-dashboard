import React, {Component} from 'react'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import axios from 'axios'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'
import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import moment from 'moment-timezone'
import cardStyle from './cardStyle'

class DateSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      reportDate: '',
      reportStart: '',
      reportEnd: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.s2ab = this.s2ab.bind(this)
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i) & 0xFF
    }
    return buf
  }

  handleSubmit() {
    if (this.state.reportDate === '') {
      alert('Please select a date for the report')
    } else {
      axios.get('/api/reports', {params: {reportStart: this.state.reportStart, reportEnd: this.state.reportEnd}}).then(response => {
        const wb = {
          SheetNames: ['Learner Data Raw', 'Funnel by Stage Raw', 'Retention by Cohort Raw'],
          Sheets: {}
        }
        const learnerData = XLSX.utils.json_to_sheet(response.data[0])
        wb.Sheets['Learner Data Raw'] = learnerData
        const funnelByStageData = XLSX.utils.json_to_sheet(response.data[1])
        wb.Sheets['Funnel by Stage Raw'] = funnelByStageData
        const retentionByCohortData = XLSX.utils.json_to_sheet(response.data[2])
        wb.Sheets['Retention by Cohort Raw'] = retentionByCohortData

        const wopts = {bookType: 'xlsx', bookSST: false, type: 'binary'}
        const wbout = XLSX.write(wb, wopts)
        FileSaver.saveAs(new Blob([this.s2ab(wbout)], {type: 'application/octet-stream'}), 'gcc_dashboard.xlsx')
      }).catch(err => {
        console.log(err.message)
      })
    }
  }

  handleChange(date) {
    this.setState({
      reportDate: moment(date).toDate(),
      reportStart: moment(date).add(1, 'days').format('YYYY-MM-DD'),
      reportEnd: moment(date).add(2, 'days').format('YYYY-MM-DD')
    })
  }

  render() {
    return (
      <Card style={cardStyle()}>
        <CardTitle title="Report Download"/>
        <CardText>
          <DatePicker
            icon="event"
            label="Select a Report Date"
            onChange={this.handleChange}
            maxDate={moment().subtract(1, 'days').toDate()}
            minDate={moment('2017-09-05').toDate()}
            value={this.state.reportDate}
          />
          <Button
            label="Download Report"
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
    )
  }
}

export default DateSelect

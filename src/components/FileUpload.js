import React, {Component} from 'react'
import Dropzone from 'react-dropzone'
import axios from 'axios'
import Card from 'react-toolbox/lib/card/Card'
import CardText from 'react-toolbox/lib/card/CardText'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import cardStyle from './cardStyle'

class FileUpload extends Component {
  constructor(props) {
    super(props)
    this.handleDrop = this.handleDrop.bind(this)
  }

  handleDrop(files) {
    const data = new FormData()
    data.append('workbook', files[0])

    axios.post('api/uploads', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      alert('File successfully uploaded')
    })
    .catch(err => console.log(err.response.data))
  }

  render() {
    return (
      <Card style={cardStyle()}>
        <CardTitle title="Vemo Data Upload"/>
        <CardText>
          <Dropzone
            onDrop={this.handleDrop}
            style={{
              width: '100%',
              height: '10em',
              padding: '1em',
              borderWidth: '2px',
              borderStyle: 'dotted',
              borderRadius: '5px'
            }}
          >
            <p>Drop the vemo_input_template file here, or click to select file.</p>
          </Dropzone>
        </CardText>
      </Card>
    )
  }
}

export default FileUpload

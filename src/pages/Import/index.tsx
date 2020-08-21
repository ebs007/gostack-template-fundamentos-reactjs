import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

import filesize from 'filesize'

import Header from '../../components/Header'
import FileList from '../../components/FileList'
import Upload from '../../components/Upload'

import {
  Container,
  Title,
  ImportFileContainer,
  Footer,
} from './styles'

import alert from '../../assets/alert.svg'
import api from '../../services/api'
import { Fragment } from 'react'

interface FileProps {
  file: File
  name: string
  readableSize: string
}

const Import: React.FC = () => {
  const [
    uploadedFiles,
    setUploadedFiles,
  ] = useState<FileProps[]>([])
  const history = useHistory()

  async function handleUpload (): Promise<void>{
    for (const element of uploadedFiles) {
      const data = new FormData()
      data.append('file', element.file)
      try {
        await api
          .post('/transactions/import', data, {
            headers:
              {
                'content-type': 'multipart/form-data',
              },
          })
          .then((response) => {
            console.log(response.data)
          })
      } catch (err) {
        console.log(err.response.error)
      }
    }
  }

  async function submitFile (files: File[]): Promise<void>{
    let filesArray: FileProps[]
    filesArray = []
    for (const element of files) {
      filesArray.push({
        name: element.name,
        file: element,
        readableSize: element.size.toString(),
      })
    }
    setUploadedFiles(filesArray)
  }

  return (
    <Fragment>
      <Header size='small' />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && (
            <FileList files={uploadedFiles} />
          )}

          <Footer>
            <p>
              <img src={alert} alt='Alert' />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type='button'>
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </Fragment>
  )
}

export default Import

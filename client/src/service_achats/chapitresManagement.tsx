import { ListItemButton, ListItemText, MenuList } from '@mui/material'
import React from 'react'

type Props = {}

const chapitresManagement = (props: Props) => {
  return (
    
    <table className=' table'>
  <thead class="thead-dark">
    <tr>
      <th scope="col">Chapitre ID</th>
      <th scope="col"> Name</th>
      <th scope="col" class="text-end">Action</th>
    </tr>
  </thead>
  <tbody>

    <tr>
      <th scope="row">05</th>
      <td>NAME</td>
      <td class="text-end">
        <a href="/viewuser/{{this.userId}}" type="button" class="btn btn-light btn-small"><i class="bi bi-eye"></i> View</a>
        <a href="/edituser/{{this.userId}}" type="button" class="btn btn-light btn-small"><i class="bi bi-pencil"></i>
          Edit</a>
        <a href="/{{this.userId}}" type="button" class="btn btn-light btn-small"><i class="bi bi-person-x"></i> Delete</a>
      </td>
    </tr>
    

  </tbody>
  </table>
  )
}

export default chapitresManagement


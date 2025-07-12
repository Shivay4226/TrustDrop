"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"

interface Review {
  _id: string
  title: string
  content: string
  rating: number
  pseudonym: string
  avatar: string
  hashtags: string[]
  sentiment: string
  sentimentScore: number
  createdAt: string
  reactions: number
  companyName?: string
  productName?: string
}

export function ReviewTable({ reviews }: { reviews: Review[] }) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead>Reactions</TableHead>
            <TableHead>Posted</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review._id}>
              <TableCell className="font-medium">{review.title}</TableCell>
              <TableCell>{review.pseudonym}</TableCell>
              <TableCell>{review.rating}</TableCell>
              <TableCell className="capitalize">{review.sentiment}</TableCell>
              <TableCell>{review.reactions}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(review.createdAt), {
                  addSuffix: true,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

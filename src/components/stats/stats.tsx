"use client";

import {
  Card,
  CardContent,
  Typography,
} from "@mui/material";

interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            marginTop: 1,
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}
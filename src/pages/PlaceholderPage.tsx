import { ArrowRight, Boxes, FileStack } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardDescription, CardTitle } from '../components/ui/card'

interface PlaceholderPageProps {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-medium text-slate-500">Workspace</p>
        <h2 className="text-[26px] font-bold tracking-[-0.04em] text-slate-900">{title}</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
      </div>
      <Card className="flex min-h-[340px] flex-col items-center justify-center px-6 py-12 text-center">
        <span className="mb-4 grid size-14 place-items-center rounded-2xl bg-blue-50 text-blue-600">
          {title === 'File Management' ? <FileStack size={25} /> : <Boxes size={25} />}
        </span>
        <Badge variant="info" className="mb-3">Workspace ready</Badge>
        <CardTitle className="text-lg">{title} workspace</CardTitle>
        <CardDescription className="mt-2 max-w-md text-sm">
          Your {title.toLowerCase()} tools will appear here. This page is ready to connect to your project data and workflows.
        </CardDescription>
        <Button type="button" variant="secondary" size="sm" className="mt-5" onClick={() => navigate('/')}>Explore dashboard <ArrowRight size={14} /></Button>
      </Card>
    </div>
  )
}

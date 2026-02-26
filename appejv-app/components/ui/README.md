# UI Components

Reusable UI components for the APPE JV app.

## Components

### Button
```tsx
import Button from '@/components/ui/Button'

<Button variant="primary">Primary Button</Button>
<Button variant="secondary">Secondary Button</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="danger">Danger Button</Button>
<Button size="sm">Small Button</Button>
<Button size="lg">Large Button</Button>
<Button disabled>Disabled Button</Button>
```

### Input
```tsx
import Input from '@/components/ui/Input'

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Invalid email"
  helperText="We'll never share your email"
/>
```

### Badge
```tsx
import Badge from '@/components/ui/Badge'

<Badge variant="default">Default</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="danger">Danger</Badge>
<Badge variant="info">Info</Badge>
```

### Card
```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Select
```tsx
import Select from '@/components/ui/Select'

<Select
  label="Country"
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  options={[
    { value: '', label: '-- Select Country --' },
    { value: 'vn', label: 'Vietnam' },
    { value: 'us', label: 'United States' },
  ]}
  error="Please select a country"
  helperText="Choose your country"
/>
```

### Modal
```tsx
import Modal, { ModalBody, ModalFooter } from '@/components/ui/Modal'

const [isOpen, setIsOpen] = useState(false)

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"
>
  <ModalBody>
    <p>Modal content goes here</p>
  </ModalBody>
  <ModalFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Submit
    </Button>
  </ModalFooter>
</Modal>
```

### Sheet
```tsx
import Sheet, { SheetBody, SheetFooter } from '@/components/ui/Sheet'

const [isOpen, setIsOpen] = useState(false)

<Sheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Sheet Title"
  position="right"
  size="md"
>
  <SheetBody>
    <p>Sheet content goes here</p>
  </SheetBody>
  <SheetFooter>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSubmit}>
      Submit
    </Button>
  </SheetFooter>
</Sheet>
```

## Props

### Button Props
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- All standard button HTML attributes

### Input Props
- `label`: string
- `error`: string
- `helperText`: string
- All standard input HTML attributes

### Badge Props
- `variant`: 'default' | 'success' | 'warning' | 'danger' | 'info'
- `children`: React.ReactNode

### Select Props
- `label`: string
- `error`: string
- `helperText`: string
- `options`: Array<{ value: string; label: string }>
- All standard select HTML attributes

### Modal Props
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `size`: 'sm' | 'md' | 'lg' | 'xl' | 'full'
- `showCloseButton`: boolean (default: true)
- `closeOnOverlayClick`: boolean (default: true)
- `children`: React.ReactNode

### Sheet Props
- `isOpen`: boolean (required)
- `onClose`: () => void (required)
- `title`: string
- `position`: 'left' | 'right' | 'top' | 'bottom' (default: 'right')
- `size`: 'sm' | 'md' | 'lg' | 'full'
- `showCloseButton`: boolean (default: true)
- `closeOnOverlayClick`: boolean (default: true)
- `children`: React.ReactNode

## Styling

All components use Tailwind CSS and follow the app's design system:
- Primary color: #175ead (blue)
- Success color: #10b981 (emerald)
- Warning color: #f59e0b (amber)
- Danger color: #ef4444 (red)
- Background: #f0f9ff (light blue)

Components are fully responsive and accessible.

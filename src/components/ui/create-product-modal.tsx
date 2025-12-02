import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Calendar,
  ImagePlus,
  Layers,
  Palette,
  Settings2,
  User,
  Wand2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type CreateProductPayload = {
  name: string;
  subtitle: string;
  description: string;
  instructor: string;
  releaseDate: string;
  covers: {
    vertical?: File | null;
    banner?: File | null;
    horizontal?: File | null;
  };
  settings: {
    certificateEnabled: boolean;
    releaseByProgress: boolean;
    progressThreshold: number;
    watermarkEnabled: boolean;
  };
};

type CreateProductModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateProductPayload) => void;
  isSubmitting?: boolean;
};

type FormErrorKey = BasicField | "description" | "settings.progressThreshold";

type FormErrors = Partial<Record<FormErrorKey, string>>;

type BasicField = "name" | "subtitle" | "instructor" | "releaseDate";

type TabType = "basic" | "media" | "settings";

const defaultFormValues: CreateProductPayload = {
  name: "",
  subtitle: "",
  description: "",
  instructor: "",
  releaseDate: "",
  covers: {
    vertical: null,
    banner: null,
    horizontal: null,
  },
  settings: {
    certificateEnabled: false,
    releaseByProgress: false,
    progressThreshold: 75,
    watermarkEnabled: false,
  },
};

export function CreateProductModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
}: CreateProductModalProps) {
  const [formValues, setFormValues] =
    useState<CreateProductPayload>(defaultFormValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [activeTab, setActiveTab] = useState<TabType>("basic");

  const clearError = (key: FormErrorKey) => {
    if (errors[key]) {
      setErrors((previous) => {
        const { [key]: _removed, ...rest } = previous;
        return rest;
      });
    }
  };

  const isSaveDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !formValues.name.trim() ||
      !formValues.description.trim() ||
      !formValues.instructor.trim() ||
      !formValues.releaseDate ||
      (formValues.settings.certificateEnabled &&
        formValues.settings.releaseByProgress &&
        (Number.isNaN(formValues.settings.progressThreshold) ||
          formValues.settings.progressThreshold <= 0 ||
          formValues.settings.progressThreshold > 100))
    );
  }, [formValues, isSubmitting]);

  useEffect(() => {
    if (!open) {
      setFormValues(defaultFormValues);
      setErrors({});
      setActiveTab("basic");
    }
  }, [open]);

  const handleTextChange = (field: BasicField, value: string) => {
    setFormValues((previous) => ({
      ...previous,
      [field]: value,
    }));
    clearError(field);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFormValues((previous) => ({
      ...previous,
      description: event.target.value,
    }));
    clearError("description");
  };

  const handleCertificateToggle = (checked: boolean | "indeterminate") => {
    const enabled = checked === true;
    setFormValues((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        certificateEnabled: enabled,
        releaseByProgress: enabled
          ? previous.settings.releaseByProgress
          : false,
        progressThreshold: enabled
          ? previous.settings.progressThreshold || 75
          : previous.settings.progressThreshold,
      },
    }));

    if (!enabled) {
      clearError("settings.progressThreshold");
    }
  };

  const handleProgressRuleToggle = (checked: boolean | "indeterminate") => {
    const enabled = checked === true;
    setFormValues((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        releaseByProgress: enabled,
        progressThreshold: enabled
          ? previous.settings.progressThreshold || 75
          : previous.settings.progressThreshold,
      },
    }));

    if (!enabled) {
      clearError("settings.progressThreshold");
    }
  };

  const handleCertificateProgressChange = (value: string) => {
    const numeric = Number(value);
    setFormValues((previous) => ({
      ...previous,
      settings: {
        ...previous.settings,
        progressThreshold: Number.isNaN(numeric) ? 0 : numeric,
      },
    }));

    if (numeric > 0 && numeric <= 100) {
      clearError("settings.progressThreshold");
    }
  };

  const handleFileChange =
    (field: keyof CreateProductPayload["covers"]) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      setFormValues((previous) => ({
        ...previous,
        covers: {
          ...previous.covers,
          [field]: file,
        },
      }));
    };

  const validate = () => {
    const newErrors: FormErrors = {};

    if (!formValues.name.trim()) {
      newErrors.name = "Informe o nome do produto";
    } else if (formValues.name.trim().length < 3) {
      newErrors.name = "Nome deve ter ao menos 3 caracteres";
    }

    if (!formValues.subtitle.trim()) {
      newErrors.subtitle = "Informe um subtítulo";
    }

    if (!formValues.description.trim()) {
      newErrors.description = "Descreva o produto";
    } else if (formValues.description.trim().length < 20) {
      newErrors.description = "Descrição deve ter ao menos 20 caracteres";
    }

    if (!formValues.instructor.trim()) {
      newErrors.instructor = "Informe o instrutor responsável";
    }

    if (!formValues.releaseDate) {
      newErrors.releaseDate = "Defina uma data de liberação";
    }

    if (
      formValues.settings.certificateEnabled &&
      formValues.settings.releaseByProgress
    ) {
      if (
        Number.isNaN(formValues.settings.progressThreshold) ||
        formValues.settings.progressThreshold <= 0 ||
        formValues.settings.progressThreshold > 100
      ) {
        newErrors["settings.progressThreshold"] =
          "Informe uma porcentagem entre 1 e 100";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validate()) {
      onSubmit(formValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 sm:max-w-5xl sm:p-0">
        <DialogHeader className="space-y-2 px-6 pt-6 sm:px-8">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Wand2 className="size-6 text-emerald-600" />
            Criar novo produto
          </DialogTitle>
          <DialogDescription>
            Cadastre o conteúdo do seu catálogo, organize as informações
            principais e adicione as capas recomendadas.
          </DialogDescription>
        </DialogHeader>

        <nav className="mb-4 flex gap-2 rounded-lg border border-emerald-100 bg-emerald-50/40 px-6 py-1 text-sm font-medium text-emerald-900 sm:px-8">
          <TabButton
            label="Informações Básicas"
            active={activeTab === "basic"}
            onClick={() => setActiveTab("basic")}
          />
          <TabButton
            label="Capas e Mídia"
            active={activeTab === "media"}
            onClick={() => setActiveTab("media")}
          />
          <TabButton
            label="Configurações"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8 px-6 pb-6 sm:px-8"
          noValidate
        >
          {activeTab === "basic" && (
            <section className="space-y-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Layers className="size-6 text-emerald-600" />
                <div>
                  <p className="text-base font-semibold text-emerald-900">
                    Informações básicas
                  </p>
                  <p className="text-sm text-emerald-800/80">
                    Campos essenciais para identificar o produto, responsável e
                    disponibilidade.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="product-name">Nome do produto</Label>
                  <Input
                    id="product-name"
                    value={formValues.name}
                    onChange={(event) =>
                      handleTextChange("name", event.target.value)
                    }
                    placeholder="Ex.: Curso Completo de React"
                    aria-invalid={errors.name ? true : undefined}
                  />
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="product-subtitle">Subtítulo</Label>
                  <Input
                    id="product-subtitle"
                    value={formValues.subtitle}
                    onChange={(event) =>
                      handleTextChange("subtitle", event.target.value)
                    }
                    placeholder="Resumo envolvente para o produto"
                    aria-invalid={errors.subtitle ? true : undefined}
                  />
                  {errors.subtitle && (
                    <p className="text-xs text-red-600">{errors.subtitle}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="product-instructor"
                    className="flex items-center gap-2"
                  >
                    <User className="size-4 text-muted-foreground" />
                    Instrutor (a)
                  </Label>
                  <Input
                    id="product-instructor"
                    value={formValues.instructor}
                    onChange={(event) =>
                      handleTextChange("instructor", event.target.value)
                    }
                    placeholder="Quem será o responsável pelo conteúdo?"
                    aria-invalid={errors.instructor ? true : undefined}
                  />
                  {errors.instructor && (
                    <p className="text-xs text-red-600">{errors.instructor}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="product-release"
                    className="flex items-center gap-2"
                  >
                    <Calendar className="size-4 text-muted-foreground" />
                    Data de liberação
                  </Label>
                  <Input
                    id="product-release"
                    type="date"
                    value={formValues.releaseDate}
                    onChange={(event) =>
                      handleTextChange("releaseDate", event.target.value)
                    }
                    aria-invalid={errors.releaseDate ? true : undefined}
                  />
                  {errors.releaseDate && (
                    <p className="text-xs text-red-600">{errors.releaseDate}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-description">Descrição</Label>
                <textarea
                  id="product-description"
                  value={formValues.description}
                  onChange={handleDescriptionChange}
                  placeholder="Conte mais sobre o produto, objetivos, público-alvo e benefícios."
                  rows={7}
                  className={cn(
                    "resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow]",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "aria-invalid:border-destructive aria-invalid:ring-destructive/20"
                  )}
                  aria-invalid={errors.description ? true : undefined}
                />
                <p className="text-xs text-muted-foreground">
                  Utilize descrições claras e objetivas com foco em benefícios.
                </p>
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>
            </section>
          )}

          {activeTab === "media" && (
            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Palette className="size-5 text-slate-600" />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Capas e peças gráficas
                  </p>
                  <p className="text-sm text-slate-600">
                    Adicione as imagens recomendadas para manter o catálogo
                    bonito e padronizado.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <ImageUploadTile
                  id="vertical-cover"
                  label="Capa Vertical"
                  helper="600 x 800 px"
                  file={formValues.covers.vertical ?? null}
                  onChange={handleFileChange("vertical")}
                  accent="border-emerald-200 bg-emerald-50/40"
                  previewAspect="3 / 4"
                />

                <ImageUploadTile
                  id="banner-cover"
                  label="Banner"
                  helper="Sugestão: 1920 x 480 px"
                  file={formValues.covers.banner ?? null}
                  onChange={handleFileChange("banner")}
                  accent="border-blue-200 bg-blue-50/40"
                  previewAspect="4 / 1"
                />

                <ImageUploadTile
                  id="horizontal-cover"
                  label="Capa Horizontal"
                  helper="Sugestão: 1280 x 720 px"
                  file={formValues.covers.horizontal ?? null}
                  onChange={handleFileChange("horizontal")}
                  accent="border-purple-200 bg-purple-50/40"
                  previewAspect="16 / 9"
                />
              </div>
            </section>
          )}

          {activeTab === "settings" && (
            <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Settings2 className="size-5 text-slate-600" />
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    Configurações adicionais
                  </p>
                  <p className="text-sm text-slate-600">
                    Personalize recursos extras como emissão de certificado.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                  <Checkbox
                    id="product-certificate"
                    checked={formValues.settings.certificateEnabled}
                    onCheckedChange={handleCertificateToggle}
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="product-certificate"
                      className="text-sm font-semibold text-emerald-900"
                    >
                      Habilitar certificado digital
                    </Label>
                    <p className="text-xs text-emerald-800/80">
                      Permite liberar um certificado automaticamente quando o
                      aluno concluir o produto.
                    </p>
                  </div>
                </div>

                {formValues.settings.certificateEnabled && (
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="certificate-progress-rule"
                        checked={formValues.settings.releaseByProgress}
                        onCheckedChange={handleProgressRuleToggle}
                        className="mt-1"
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="certificate-progress-rule"
                          className="text-sm font-semibold text-slate-900"
                        >
                          Liberar certificado com base no progresso
                        </Label>
                        <p className="text-xs text-slate-600">
                          Quando ativo, o aluno precisa atingir um percentual
                          mínimo do curso para receber o certificado.
                        </p>
                      </div>
                    </div>

                    {formValues.settings.releaseByProgress && (
                      <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-medium text-slate-900">
                            Progresso mínimo do curso
                          </p>
                          <p className="text-xs text-muted-foreground">
                            O certificado é emitido quando o aluno atinge a
                            porcentagem definida.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            id="certificate-progress"
                            type="number"
                            inputMode="numeric"
                            min={1}
                            max={100}
                            step={1}
                            value={formValues.settings.progressThreshold}
                            onChange={(event) =>
                              handleCertificateProgressChange(
                                event.target.value
                              )
                            }
                            className="w-24 text-center"
                            aria-invalid={
                              errors["settings.progressThreshold"]
                                ? true
                                : undefined
                            }
                          />
                          <span className="text-sm font-medium text-slate-600">
                            %
                          </span>
                        </div>
                      </div>
                    )}

                    {errors["settings.progressThreshold"] && (
                      <p className="text-xs text-red-600">
                        {errors["settings.progressThreshold"]}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
                  <Checkbox
                    id="enable-watermark"
                    checked={formValues.settings.watermarkEnabled}
                    onCheckedChange={(checked) =>
                      setFormValues((previous) => ({
                        ...previous,
                        settings: {
                          ...previous.settings,
                          watermarkEnabled: checked === true,
                        },
                      }))
                    }
                    className="mt-1"
                  />
                  <div className="space-y-1">
                    <Label
                      htmlFor="enable-watermark"
                      className="text-sm font-semibold text-slate-900"
                    >
                      Habilitar marca d’água nos materiais
                    </Label>
                    <p className="text-xs text-slate-600">
                      Aplica automaticamente uma marca d’água com os dados do
                      aluno em PDFs e vídeos protegidos.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          <DialogFooter>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md border border-input bg-white px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              disabled={isSaveDisabled}
            >
              <Wand2 className="size-4" />
              Criar produto
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type ImageUploadTileProps = {
  id: string;
  label: string;
  helper: string;
  file: File | null;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  accent: string;
  previewAspect: string;
};

function ImageUploadTile({
  id,
  label,
  helper,
  file,
  onChange,
  accent,
  previewAspect,
}: ImageUploadTileProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "group flex h-full cursor-pointer flex-col gap-3 rounded-xl border-2 border-dashed p-4 text-center transition-colors hover:border-emerald-500 hover:bg-emerald-50/60",
        accent
      )}
    >
      <div className="flex flex-col items-center gap-2 text-sm">
        <ImagePlus className="size-6 text-emerald-600" />
        <span className="font-medium text-slate-900">{label}</span>
        <span className="text-xs text-muted-foreground">{helper}</span>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div
          className="w-full max-w-[180px] rounded-md border border-dashed border-slate-300 bg-gradient-to-br from-white to-slate-100/80 text-xs text-muted-foreground shadow-inner"
          style={{ aspectRatio: previewAspect }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              Preview
            </span>
            <span className="text-[10px] text-slate-400">
              {previewAspect.replace(" / ", ":")}
            </span>
          </div>
        </div>
      </div>
      <div className="rounded-lg bg-white/60 px-3 py-2 text-xs text-slate-600 shadow-inner">
        {file ? file.name : "Selecione uma imagem"}
      </div>
      <Input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onChange}
      />
    </label>
  );
}

type TabButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function TabButton({ label, active, onClick }: TabButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md px-4 py-2 transition-colors",
        active
          ? "bg-white text-emerald-700 shadow-sm"
          : "text-emerald-700/70 hover:bg-white/70"
      )}
    >
      {label}
    </button>
  );
}

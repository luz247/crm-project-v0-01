  export const getPersonType = (rutValue: string): "Natural" | "Jurídica" => {
    if (!rutValue) return "Natural"

    // Remove dots and hyphens, get only the number part
    const cleanRut = rutValue.replace(/[.-]/g, "")
    const rutNumber = Number.parseInt(cleanRut.slice(0, -1))

    // In Chile, RUTs above 50,000,000 are typically legal entities (companies)
    // RUTs below this are usually natural persons
    if (rutNumber >= 50000000) {
      return "Jurídica"
    }

    return "Natural"
  }

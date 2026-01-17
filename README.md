

## Cara Menjalankan

### Prerequisites

- Node.js 18+ dan npm

### Setup

1. Pastikan Node.js dan npm terinstall dan backend sudah berjalan sebelum menjalankan frontend.
2. Jalankan `npm install` untuk install dependencies.
3. Jalankan `npm run dev` untuk development server.
4. Akses di http://localhost:3000.

## Penjelasan Singkat Arsitektur

Aplikasi ini menggunakan arsitektur client-server:

- **Frontend**: Next.js dengan React, menggunakan Client-Side Rendering (CSR) untuk interaktivitas real-time.
- **Backend**: API RESTful yang menangani business logic, data persistence, dan audit logging.
- **Komunikasi**: Fetch API untuk HTTP/S requests ke backend.
- **State Management**: useState hooks di React untuk state lokal.
- **Error Handling**: Mapping error HTTP ke UI error types.

Folder struktur:

- `app/`: Next.js App Router
- `CSR/`: Komponen utama dan logic (Client-Side Rendering)
  - `handlers/`: Fungsi untuk API calls
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions seperti error mapping


## Trade-off yang Dibuat

1. **CSR vs SSR**: Menggunakan CSR untuk simplicity dan real-time updates, trade-off adalah initial load time dan SEO (karena tidak ada SSR).
2. **No State Management Library**: Menggunakan useState saja untuk simplicity, trade-off adalah tidak scalable untuk state kompleks.
3. **Manual Error Handling**: Error mapping sederhana, trade-off adalah tidak comprehensive untuk semua error cases.
4. **No Caching**: Tidak ada caching untuk API calls, trade-off adalah performance untuk data yang sering diakses.
5. **Inline Styling**: Menggunakan Tailwind classes langsung, trade-off adalah maintainability untuk styles kompleks.

## Jika Ada Waktu Lebih, Apa yang Akan Diperbaiki

1. **Better State Management**: Gunakan Zustand atau Redux untuk state yang lebih kompleks.
2. **Testing**: Tambahkan unit tests dan integration tests.
3. **Error Boundaries**: Implement React Error Boundaries untuk better error handling.
4. **Loading States**: Tambahkan loading indicators untuk better UX.
5. **Optimistic Updates**: Update UI immediately, rollback jika API fail.
6. **Performance**: Implement pagination untuk large task lists dan lazy loading.

## Bagaimana Kamu Memastikan Audit Log Tidak Ter-modifikasi?

Audit log disimpan di backend database. Untuk memastikan tidak ter-modifikasi:

1. **Immutable Logs**: Design log table sebagai append-only, tanpa UPDATE/DELETE operations.
2. **Cryptographic Hashing**: Setiap log entry include hash dari previous entry untuk blockchain-like immutability.
3. **Access Control**: Backend API hanya allow INSERT untuk logs, tidak ada endpoint untuk modify.

## Bagian Mana dari Solusi Ini yang Paling Berisiko Jika Digunakan oleh Banyak User?

1. **No Authentication**: User bisa masukkan nama actor sembarang, risiko impersonation.
2. **No Rate Limiting**: API calls tidak dibatasi, risiko DoS attacks.
3. **No Input Sanitization**: Risiko XSS jika backend tidak sanitize input.
4. **Single Point of Failure**: Jika backend down, frontend tidak bisa berfungsi.
5. **No Caching**: High load pada database untuk banyak concurrent users.
6. **No Pagination/Lazy Loading**: Jika tasks banyak, performance degrade.
7. **Manual Refresh**: User perlu manual refresh untuk updates dari user lain. (masih belum menggunakan observer-style untuk data update)

Risiko tertinggi adalah **security vulnerabilities** karena tidak ada authentication dan input validation proper.

## Jika Task Ini Berkembang Menjadi Sistem Besar, Bagian Mana yang Akan Kamu Refactor Terlebih Dahulu dan Kenapa?

**State Management & Architecture**: Refactor dari useState ke proper state management library (Zustand/Redux) dan implement feature-based folder structure.

Kenapa:

- Saat ini logic tersebar di komponen, sulit maintain dan test.
- Untuk sistem besar, perlu separation of concerns, reusability, dan predictable state updates.
- Performance issues dengan re-renders untuk complex state.
- Testing sulit tanpa proper state management.

Prioritas refactor:

1. Extract business logic ke custom hooks atau services.
2. Implement global state untuk shared data (tasks, user info).
3. Add middleware untuk API calls (error handling, loading states).
4. Implement proper component composition dengan compound components.

## Jika Kamu Menggunakan AI, Jelaskan Bagian Mana yang Dibantu AI dan Bagaimana Kamu Memvalidasinya

Saya menggunakan GitHub Copilot + ChatGPT 5.2 untuk membantu development:

**Bagian yang Dibantu AI:**

1. **Intent Extraction**: AI digunakan untuk melakukan separation of concern dari fitur yang must-have hingga nice-to-have.
2. **Code Completion**: Auto-complete untuk React hooks, fetch calls, dan Tailwind classes.
3. **Refactoring Suggestions**: Struktur diambil menggunakan perintah "tree" lalu disesuaikan dengan common practice dengan limitation yang ada.
4. **Error Handling**: AI membantu generate error mapping logic.
5. **Penulisan README.md**: AI dipergunakan untuk review project serta building relevant information dari project.

**Bagaimana Validasi:**

1. **Manual Review**: Semua code dan structure yang di-generate ditinjau manual untuk correctness dan security serta kesesuaian dengan konsep penulis.
2. **Testing**: Jalankan aplikasi dan test semua features (create, update, delete tasks, view logs). itulah sebabnya mungkin ada beberapa function yang sengaja dibiarkan ada untuk proof bahwa testing dilakukan.
3. **Linting**: Gunakan ESLint untuk membantu melihat adanya potential issues.
4. **Type Checking**: TypeScript compiler memastikan type safety (concern terhadap types dipisah dalam folder \types untuk memudahkan checking terhadap types yang digenerate).
5. **Runtime Testing**: Test edge cases seperti network errors, invalid inputs.
6. **Code/README.md Review**: Memastikan kembali kesesuaian requirement dengan resource yang disediakan.

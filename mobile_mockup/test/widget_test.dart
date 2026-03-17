import 'package:flutter_test/flutter_test.dart';

import 'package:mobile_mockup/app/report_mockup_app.dart';

void main() {
  testWidgets('mockup page renders main actions', (WidgetTester tester) async {
    await tester.pumpWidget(const ReportMockupApp());

    expect(find.text('Reportar Ocorrencia'), findsOneWidget);
    expect(find.text('Tirar fotografia'), findsOneWidget);
    expect(find.text('Definir localizacao'), findsOneWidget);
    expect(find.text('Enviar dados'), findsOneWidget);
  });
}
